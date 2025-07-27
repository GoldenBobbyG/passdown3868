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
import sendPdfRoute from './routes/sendPdf.js'; // Add this import


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3001;

interface MyContext {
  user?: any;
}

const startApolloServer = async () => {
  try {
    // ✅ FIXED: Connect to database directly with await
    console.log('📡 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/passdown3868');
    console.log('✅ Database connected successfully');

    const app = express();
    const httpServer = http.createServer(app);
    
    const server = new ApolloServer<MyContext>({
      typeDefs,
      resolvers,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();
    console.log('✅ Apollo Server started');

    // Body parsing middleware
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Add the email route BEFORE GraphQL middleware
    app.use('/api', sendPdfRoute);

    // GraphQL middleware
    const graphqlMiddleware = expressMiddleware(server, {
      context: async ({ req }) => authenticateToken({ req })
    });

    app.use(
      '/graphql',
      cors<cors.CorsRequest>({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        credentials: true,
      }),
      express.json(),
      graphqlMiddleware
    );

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server ready at http://localhost:${PORT}`);
      console.log(`🎯 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      console.log(`📧 Email API: http://localhost:${PORT}/api/send-dashboard-image`);
    });

  } catch (error) {
    console.error('❌ Error starting server:', error);
    process.exit(1);
  }
};

startApolloServer();