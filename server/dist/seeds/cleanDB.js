import { User, ShiftLog, YardHealth } from '../models/index';
import process from 'process';
const cleanDB = async () => {
    try {
        // Clear all collections
        await User.deleteMany({});
        await ShiftLog.deleteMany({});
        await YardHealth.deleteMany({});
        console.log('Database cleaned successfully.');
    }
    catch (error) {
        console.error('Error cleaning database:', error);
        process.exit(1);
    }
};
export default cleanDB;
