import mongoose, { Schema, model, Document, } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  department?: string;
  role?: 'Team Member' | 'Supervisor' | 'Manager' | 'Admin';
  shiftHistory?: mongoose.Types.ObjectId[];
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Must match an email address!'],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  department: {
    type: String,
    default: 'Yard Operations',
  },
  role: {
    type: String,
    enum: ['Team Member', 'Supervisor', 'Manager', 'Admin'],
    default: 'Team Member',
  }
});
userSchema.pre<IUser>('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  
  next();
});
userSchema.methods.isCorrectPassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
