// db.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectMockDb } from './mockDb';

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/task-tracker-db');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.warn(`MongoDB connection failed: ${error.message}`);
        console.warn('Falling back to in-memory mock database for development...');
        await connectMockDb();
        
        // Enable mock mode globally
        (global as any).__USE_MOCK_DB__ = true;
    }
};

export default connectDB;
