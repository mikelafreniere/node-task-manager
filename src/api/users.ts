import * as express from 'express';
import * as mongoose from 'mongoose';
import { UserModel, User } from '../model/user';
import { StatusCodes } from 'http-status-codes';
import { isValidUpdate } from './adapters/adapters';

export const router = express.Router();

router.post('/users', async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    const user = await newUser.save();
    return res.status(StatusCodes.CREATED).send(user.toJSON());
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({});
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
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

router.patch('/users/:id', async (req, res) => {
  if (!isValidUpdate(User, req)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid update request' });
  }

  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await UserModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'User not found' });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (err) {
    // TODO: handle different error codes
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});
