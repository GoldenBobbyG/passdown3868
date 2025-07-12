import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passdown3868';

mongoose.connect(MONGO_URI);

console.log('Database connection initiated');

export default mongoose.connection;
