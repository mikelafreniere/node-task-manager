import * as express from 'express';
import * as mongoose from 'mongoose';
import { User, UserDocument } from '../model/user';
import { StatusCodes } from 'http-status-codes';
import { isValidUpdate } from './adapters/adapters';

export const router = express.Router();

// TODO: omit passwords from returned users

router.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(StatusCodes.CREATED).send(user.toJSON());
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(StatusCodes.OK).send(users);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Unable to list users');
  }
});

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

router.patch('/users/:id', async (req, res) => {
  // TODO: build update user schema validator

  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (err) {
    // TODO: handle different error codes
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.delete('/users/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.findByIdAndDelete(_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
