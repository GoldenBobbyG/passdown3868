import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import mongoose from 'mongoose'; // Import mongoose directly
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;
const startApolloServer = async () => {
    try {
        // ✅ FIXED: Connect to database directly with await
        console.log('📡 Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passdown3868');
        console.log('✅ Database connected successfully');
        const app = express();
        const httpServer = http.createServer(app);
        const server = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        });
        await server.start();
        console.log('✅ Apollo Server started');
        // Body parsing middleware
        app.use(express.urlencoded({ extended: false }));
        // GraphQL middleware
        const graphqlMiddleware = expressMiddleware(server, {
            context: async ({ req }) => authenticateToken({ req })
        });
        app.use('/graphql', cors({
            origin: ['http://localhost:3000', 'http://localhost:5173'],
            credentials: true,
        }), express.json(), graphqlMiddleware);
        // Serve static files in production
        if (process.env.NODE_ENV === 'production') {
            app.use(express.static(path.join(__dirname, '../client/dist')));
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '../client/dist/index.html'));
            });
        }
        // ✅ FIXED: Start server immediately after setup
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}`);
            console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};
startApolloServer();
