import { Schema, model } from 'mongoose';
import { default as validator } from 'validator';

export class User {
  name: string = '';
  email: string = '';
  password: string = '';
  age?: number = 0;
}

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate(value: string) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password cannot contain word "password"');
      }
    },
  },
  age: {
    type: Number,
    default: 0,
    validate(value: number) {
      if (value < 0) {
        throw new Error('Age must be a positive number');
      }
    },
  },
});

export const UserModel = model<User>('User', userSchema);
