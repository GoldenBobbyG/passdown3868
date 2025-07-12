import User from '../models/User.js';
import ShiftLog from '../models/Shiftlog.js';
import YardHealth from '../models/YardHealth.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
import { Document, Types } from 'mongoose';

// User interfaces
export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  shiftHistory?: Types.ObjectId[];
  isCorrectPassword(password: string): Promise<boolean>;
}

export interface IUserInput {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

// ShiftLog interfaces
export interface IShiftLog extends Document {
  _id: Types.ObjectId;
  username: string;
  date: Date;
  [key: string]: any;
}

export interface IShiftLogInput {
  username: string;
  date: Date;
  [key: string]: any;
}

// YardHealth interfaces
export interface IYardHealth extends Document {
  _id: Types.ObjectId;
  date: Date;
  [key: string]: any;
}

export interface IYardHealthInput {
  date: Date;
  [key: string]: any;
}

// Auth and context
export interface IAuthPayload {
  token: string;
  user: IUser;
}

export interface IContext {
  user?: IUser | null;
}

// Mutation return types
export interface ISuccessMessage {
  success: boolean;
  message: string;
}

export const resolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: IContext): Promise<IUser | null> => {
      if (!context.user) throw new AuthenticationError('Not logged in');
      return await User.findById(context.user._id).populate('shiftHistory') as IUser | null;
    },

    user: async (_: unknown, { username }: { username: string }): Promise<IUser | null> => {
      return await User.findOne({ username }).populate('shiftHistory') as IUser | null;
    },

    users: async (): Promise<IUser[]> => {
      return await User.find({});
    },

    shiftLogs: async (
      _: unknown,
      { username, dateRange }: { username?: string; dateRange?: Date }
    ): Promise<IShiftLog[]> => {
      const filter: Record<string, any> = {};
      if (username) filter.username = username;
      if (dateRange) filter.date = { $gte: dateRange };
      return await ShiftLog.find(filter);
    },

    yardHealth: async (_: unknown, { date }: { date: Date }): Promise<IYardHealth | null> => {
      return await YardHealth.findOne({ date });
    },

    recentShifts: async (_: unknown, { limit = 5 }: { limit?: number }): Promise<IShiftLog[]> => {
      return await ShiftLog.find().sort({ createdAt: -1 }).limit(limit);
    },
  },

  Mutation: {
    login: async (
      _: unknown,
      { email, password }: { email: string; password: string }
    ): Promise<IAuthPayload> => {
      const userDoc = await User.findOne({ email });
      if (!userDoc) throw new AuthenticationError('User not found');

      const valid = await userDoc.isCorrectPassword(password);
      if (!valid) throw new AuthenticationError('Invalid credentials');

      // Ensure _id is Types.ObjectId
      const user = userDoc as IUser;
      const token = signToken(String(user._id), user.username, user.email);
      return { token, user };
    },

    addUser: async (
      _: unknown,
      { input }: { input: IUserInput }
    ): Promise<IAuthPayload> => {
      const existing = await User.findOne({ email: input.email });
      if (existing) throw new AuthenticationError('User already exists');

      const userDoc = await User.create(input);
      const user = userDoc as IUser;
      const token = signToken(String(user._id), user.username, user.email);
      return { token, user };
    },

    updateUser: async (
      _: unknown,
      { input }: { input: Partial<IUserInput> },
      context: IContext
    ): Promise<IUser | null> => {
      if (!context.user) throw new AuthenticationError('Unauthorized');
      return await User.findByIdAndUpdate(context.user._id, input, { new: true });
    },

    deleteUser: async (
      _: unknown,
      { userId }: { userId: string }
    ): Promise<IUser | null> => {
      return await User.findByIdAndDelete(userId);
    },

    addShiftLog: async (
      _: unknown,
      { input }: { input: IShiftLogInput }
    ): Promise<IShiftLog> => {
      const newLog = await ShiftLog.create(input);
      await User.findOneAndUpdate(
        { username: input.username },
        { $push: { shiftHistory: newLog._id } }
      );
      return newLog;
    },

    updateShiftLog: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<IShiftLogInput> }
    ): Promise<IShiftLog | null> => {
      return await ShiftLog.findByIdAndUpdate(id, input, { new: true });
    },

    deleteShiftLog: async (
      _: unknown,
      { id }: { id: string }
    ): Promise<IShiftLog | null> => {
      return await ShiftLog.findByIdAndDelete(id);
    },

    addYardHealth: async (
      _: unknown,
      { input }: { input: IYardHealthInput }
    ): Promise<IYardHealth> => {
      return await YardHealth.create(input);
    },

    updateYardHealth: async (
      _: unknown,
      { id, input }: { id: string; input: Partial<IYardHealthInput> }
    ): Promise<IYardHealth | null> => {
      return await YardHealth.findByIdAndUpdate(id, input, { new: true });
    },

    sendPassdownEmail: async (
      _: unknown,
      { shiftLogId, managerEmail, message }: { shiftLogId: string; managerEmail: string; message: string }
    ): Promise<ISuccessMessage> => {
      // Plug in real email logic here
      console.log(`Email sent to ${managerEmail} for shift log ${shiftLogId}: ${message}`);
      return {
        success: true,
        message: "Email sent (mock)",
      };
    },

    updatePassword: async (
      _: unknown,
      { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
      context: IContext
    ): Promise<ISuccessMessage> => {
      if (!context.user) throw new AuthenticationError('Unauthorized');

      const user = await User.findById(context.user._id);
      if (!user) throw new AuthenticationError('User not found');
      const valid = await user.isCorrectPassword(currentPassword);
      if (!valid) throw new AuthenticationError('Incorrect current password');

      user.password = newPassword;
      await user.save();
      return { success: true, message: 'Password updated' };
    },

    resetPassword: async (
      _: unknown,
      { email }: { email: string }
    ): Promise<ISuccessMessage> => {
      // You would send a real reset link or code here
      console.log(`Reset password requested for ${email}`);
      return { success: true, message: 'Reset link sent (mock)' };
    },
  },
};

export default resolvers;