import db from '../config/connection.js';
import { User } from '../models/index.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Read JSON file synchronously
// Read from source directory, not dist directory
const userDataPath = path.join(__dirname, '../../seeds/userData.json'); // Go back to source
const userData = JSON.parse(readFileSync(userDataPath, 'utf8'));
(async () => {
    try {
        const connection = db;
        connection.once('open', async () => {
            try {
                console.log('🔄 Starting database seeding...');
                await User.deleteMany({});
                console.log('🗑️ Cleared existing data');
                const users = await User.create(userData);
                const usersArray = Array.isArray(users) ? users : [users];
                console.log(`✅ Created ${usersArray.length} users`);
                console.log('\n📋 Login Credentials:');
                usersArray.forEach(user => {
                    console.log(`${user.email} | password123`);
                });
                process.exit(0);
            }
            catch (err) {
                console.error('❌ Error seeding database:', err);
                process.exit(1);
            }
        });
    }
    catch (err) {
        console.error('❌ Error connecting to database:', err);
        process.exit(1);
    }
})();
