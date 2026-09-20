import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to MongoDB Atlas first
    await mongoose.connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Only start listening after successful DB connection
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on port ${env.PORT}`);
    });

    // Graceful Shutdown on process termination signals
    const handleShutdown = async (signal) => {
      console.log(`\n${signal} received. Closing HTTP server and DB connection...`);
      server.close(async () => {
        await mongoose.connection.close();
        console.log('DB connection closed. Process exited cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => handleShutdown('SIGINT'));
    process.on('SIGTERM', () => handleShutdown('SIGTERM'));

  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();