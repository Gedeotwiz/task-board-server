import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/todos_db';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(databaseUrl);
    console.log('Connected to MongoDB ');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
