import { connect as mongooseConnect } from 'mongoose';

const DB_URI = 'mongodb://127.0.0.1:27017/task-manager';

export function connect() {
  try {
    mongooseConnect(DB_URI);
    console.log('Database connected');
  } catch {
    console.log('Database error');
  }
}
