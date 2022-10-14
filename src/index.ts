import * as express from 'express';
import * as mongoose from 'mongoose';
import { TaskModel, Task } from './models/task';
import { UserModel, User } from './models/user';

require('./db/database');

const app = express();

app.use(express.json());

// ENDPOINTS

// ~~~ User endpoints ~~~
app.post('/users', async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    const user = await newUser.save();
    return res.status(201).send(user.toJSON());
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({});
    return res.status(200).send(users);
  } catch (err) {
    return res.status(500).send('Unable to list users');
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const fieldMask = Object.keys(new User());
  const isValid = updates.every((update) => fieldMask.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid update request' });
  }

  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ error: 'Invalid user ID' });
  }

  try {
    const user = await UserModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }
    return res.status(200).send(user);
  } catch (err) {
    // TODO: handle different error codes
    return res.status(400).send(err);
  }
});

// ~~~ Task endpoints ~~~
app.post('/tasks', async (req, res) => {
  const newTask = new TaskModel(req.body);
  try {
    const task = await newTask.save();
    return res.status(201).send(task.toJSON());
  } catch (err) {
    return res.status(400).send(err);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    return res.status(200).send(tasks);
  } catch (err) {
    return res.status(500).send({ error: 'Unable to list tasks' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.findById(_id);
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    return res.status(200).send(task);
  } catch (err) {
    return res.status(500).send(err);
  }
});

app.patch('/tasks/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const fieldMask = Object.keys(new Task());
  const isValid = updates.every((update) => fieldMask.includes(update));

  if (!isValid) {
    return res.status(400).send({ error: 'Invalid update request' });
  }

  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send({ error: 'Invalid task ID' });
  }

  try {
    const task = await TaskModel.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!task) {
      return res.status(404).send({ error: 'Task not found' });
    }
    return res.status(200).send(task);
  } catch (err) {
    // TODO: handle different error codes
    return res.status(400).send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running on port ' + port));
