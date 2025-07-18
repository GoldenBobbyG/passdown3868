import { Schema, model, } from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new Schema({
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
// This commit adds a pre-save hook to the userSchema to hash the password before saving it to the database.
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});
// This commit adds a method to the userSchema to check if the provided password matches the hashed password stored in the database.
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};
const User = model('User', userSchema);
export default User;
