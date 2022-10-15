import * as express from 'express';
import * as mongoose from 'mongoose';
import { TaskModel, Task } from '../model/task';
import { StatusCodes } from 'http-status-codes';
import { isValidUpdate } from './adapters/adapters';

export const router = express.Router();

router.post('/tasks', async (req, res) => {
  const newTask = new TaskModel(req.body);
  try {
    const task = await newTask.save();
    return res.status(StatusCodes.CREATED).send(task.toJSON());
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    return res.status(StatusCodes.OK).send(tasks);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ error: 'Unable to list tasks' });
  }
});

router.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.findById(_id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'Task not found' });
    }
    return res.status(StatusCodes.OK).send(task);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});

router.patch('/tasks/:id', async (req, res) => {
  if (!isValidUpdate(Task, req)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid update request' });
  }

  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'Task not found' });
    }
    return res.status(StatusCodes.OK).send(task);
  } catch (err) {
    // TODO: handle different error codes
    return res.status(StatusCodes.BAD_REQUEST).send(err);
  }
});

router.delete('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(StatusCodes.BAD_REQUEST).send({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.findByIdAndDelete(_id);
    if (!task) {
      return res.status(StatusCodes.NOT_FOUND).send({ error: 'Task not found' });
    }
    return res.status(StatusCodes.OK).send(task);
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
  }
});
