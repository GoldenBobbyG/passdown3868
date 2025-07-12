import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
import db from './config/connection.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;
const startApolloServer = async () => {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
    await server.start();
    // Body parsing middleware for non-GraphQL routes
    app.use(express.urlencoded({ extended: false }));
    // ✅ FIXED: Create middleware separately with explicit typing
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
    // ✅ FIXED: Use httpServer for listening instead of app directly
    db.once('open', () => {
        httpServer.listen(PORT, () => {
            console.log(`🚀 Server ready at http://localhost:${PORT}`);
            console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}/graphql`);
        });
    });
    db.on('error', (error) => {
        console.error('❌ Database connection error:', error);
    });
};
startApolloServer().catch(error => {
    console.error('❌ Error starting server:', error);
    process.exit(1);
});
