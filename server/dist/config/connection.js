import dotenv from 'dotenv';
dotenv.config();
// This commit initializes dotenv to load environment variables from a .env file
// This commit mongoose is used to connect to a MongoDB database
import mongoose from 'mongoose';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passdown3868';
mongoose.connect(MONGO_URI);
console.log('Database connection initiated');
export default mongoose.connection;
