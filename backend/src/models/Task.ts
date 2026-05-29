// Task.ts
import mongoose from 'mongoose';
import { mockDb } from '../config/mockDb';

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        default: 'todo',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    dueDate: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Task = (global as any).__USE_MOCK_DB__ 
    ? mockDb.tasks as any
    : mongoose.model('Task', taskSchema);
export default Task;
