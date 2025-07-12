import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || '';
const db = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Database connected successfully');
        return mongoose.connection;
    }
    catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Database connection failed');
    }
};
export default db;
