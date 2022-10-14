import { Schema, model } from 'mongoose';

export class Task {
  description: string = '';
  completed: boolean = false;
}

const taskSchema = new Schema<Task>({
  description: { type: String, required: true, trim: true },
  completed: { type: Boolean, default: false },
});

export const TaskModel = model<Task>('Task', taskSchema);
