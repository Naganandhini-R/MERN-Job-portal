import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('=> Using existing database connection');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI environment variable is missing.');
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  try {
    mongoose.connection.on('connected', () => {
      console.log('Database Connected');
    });

    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast in serverless environment (5s)
    });

    isConnected = db.connections[0].readyState === 1;
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error; // Let Vercel catch and log the error instead of abrupt process.exit(1)
  }
};

export default connectDB;
