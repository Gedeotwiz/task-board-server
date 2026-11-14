import { model, Schema } from 'mongoose';
import type { Priority, Task, TaskStatus } from './types.js';

const taskSchema = new Schema<Task>({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  category: { type: String, default: 'General' },
  status: { type: String, enum: ['todo', 'progress', 'done'] satisfies TaskStatus[], default: 'todo' },
  due: { type: String, default: '' },
  members: { type: [String], default: [] },
  subtasks: { type: Number, min: 0, default: 0 },
  done: { type: Number, min: 0, default: 0 },
  priority: { type: String, enum: ['Low', 'Medium', 'High'] satisfies Priority[], default: 'Medium' },
}, { versionKey: false });

export const TaskModel = model<Task>('Task', taskSchema);
