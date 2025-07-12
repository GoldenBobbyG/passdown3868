import db from '../config/connection'
import {  User,ShiftLog,YardHealth,PassdownEmail } from '../models/index';
import cleanDB from './cleanDB';

import userData from './userData.json' assert { type: 'json' };

const seedDatabase = async (): Promise<void> => {
    try {
        await db();
        await cleanDB();

        await User.create(userData);
        console.log('Database seeded successfully with user data.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
