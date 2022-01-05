import { Schema, model } from 'mongoose';
import { default as validator } from 'validator';

interface User {
  name: string;
  email: string;
  age?: number;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  age: {
    type: Number,
    validate(value: number) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
});

export const UserModel = model<User>('User', userSchema);
