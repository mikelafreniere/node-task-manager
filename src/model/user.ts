import { Document, Schema, model } from 'mongoose';
import { default as validator } from 'validator';
import * as bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
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
      unique: true,
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
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('')) return next();

  const salt = await bcrypt.genSalt(8);
  user.password = await bcrypt.hash(user.password, salt);

  return next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  const user = this as UserDocument;
  try {
    return bcrypt.compare(candidate, user.password);
  } catch (err) {
    return false;
  }
};

export const User = model<UserDocument>('User', userSchema);
