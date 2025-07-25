import User from '../models/User.js';
import ShiftLog from '../models/Shiftlog.js';
import YardHealth from '../models/YardHealth.js';
import { signToken, AuthenticationError } from '../utils/auth.js';
export const resolvers = {
    Query: {
        me: async (_, __, context) => {
            if (!context.user)
                throw new AuthenticationError('Not logged in');
            return await User.findById(context.user._id).populate('shiftHistory');
        },
        user: async (_, { username }) => {
            return await User.findOne({ username }).populate('shiftHistory');
        },
        users: async () => {
            return await User.find({});
        },
        shiftLogs: async (_, { username, dateRange }) => {
            const filter = {};
            if (username)
                filter.username = username;
            if (dateRange)
                filter.date = { $gte: dateRange };
            return await ShiftLog.find(filter);
        },
        yardHealth: async (_, { date }) => {
            return await YardHealth.findOne({ date });
        },
        recentShifts: async (_, { limit = 5 }) => {
            return await ShiftLog.find().sort({ createdAt: -1 }).limit(limit);
        },
    },
    Mutation: {
        login: async (_, { email, password }) => {
            const userDoc = await User.findOne({ email });
            if (!userDoc)
                throw new AuthenticationError('User not found');
            const valid = await userDoc.isCorrectPassword(password);
            if (!valid)
                throw new AuthenticationError('Invalid credentials');
            // Ensure _id is Types.ObjectId
            const user = userDoc;
            const token = signToken(String(user._id), user.username, user.email);
            return { token, user };
        },
        addUser: async (_, { input }) => {
            const existing = await User.findOne({ email: input.email });
            if (existing)
                throw new AuthenticationError('User already exists');
            const userDoc = await User.create(input);
            const user = userDoc;
            const token = signToken(String(user._id), user.username, user.email);
            return { token, user };
        },
        updateUser: async (_, { input }, context) => {
            if (!context.user)
                throw new AuthenticationError('Unauthorized');
            return await User.findByIdAndUpdate(context.user._id, input, { new: true });
        },
        deleteUser: async (_, { userId }) => {
            return await User.findByIdAndDelete(userId);
        },
        addShiftLog: async (_, { input }) => {
            const newLog = await ShiftLog.create(input);
            await User.findOneAndUpdate({ username: input.username }, { $push: { shiftHistory: newLog._id } });
            return newLog;
        },
        updateShiftLog: async (_, { id, input }) => {
            return await ShiftLog.findByIdAndUpdate(id, input, { new: true });
        },
        deleteShiftLog: async (_, { id }) => {
            return await ShiftLog.findByIdAndDelete(id);
        },
        addYardHealth: async (_, { input }) => {
            return await YardHealth.create(input);
        },
        updateYardHealth: async (_, { id, input }) => {
            return await YardHealth.findByIdAndUpdate(id, input, { new: true });
        },
        sendPassdownEmail: async (_, { shiftLogId, managerEmail, message }) => {
            // Plug in real email logic here
            console.log(`Email sent to ${managerEmail} for shift log ${shiftLogId}: ${message}`);
            return {
                success: true,
                message: "Email sent (mock)",
            };
        },
        updatePassword: async (_, { currentPassword, newPassword }, context) => {
            if (!context.user)
                throw new AuthenticationError('Unauthorized');
            const user = await User.findById(context.user._id);
            if (!user)
                throw new AuthenticationError('User not found');
            const valid = await user.isCorrectPassword(currentPassword);
            if (!valid)
                throw new AuthenticationError('Incorrect current password');
            user.password = newPassword;
            await user.save();
            return { success: true, message: 'Password updated' };
        },
        resetPassword: async (_, { email }) => {
            // You would send a real reset link or code here
            console.log(`Reset password requested for ${email}`);
            return { success: true, message: 'Reset link sent (mock)' };
        },
    },
};
export default resolvers;
