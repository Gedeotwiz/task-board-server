import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/todos_db';

export async function connectToDatabase(): Promise<void> {
  await mongoose.connect(databaseUrl);
  console.log('Connected to MongoDB');
}
