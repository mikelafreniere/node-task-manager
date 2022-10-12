import * as express from 'express';
import * as mongoose from 'mongoose';
import { TaskModel } from './models/task';
import { UserModel } from './models/user';

require('./db/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoints
app.post('/users', async (req, res) => {
  const newUser = new UserModel(req.body);
  try {
    const user = await newUser.save();
    res.status(201).send(user.toJSON());
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send('Unable to list users');
  }
});

app.get('/users/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).send();
  }

  try {
    const user = await UserModel.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/tasks', async (req, res) => {
  const newTask = new TaskModel(req.body);
  try {
    const task = await newTask.save();
    res.status(201).send(task.toJSON());
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.find({});
    res.status(200).send(tasks);
  } catch (err) {
    res.status(500).send('Unable to list tasks');
  }
});

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send();
    return;
  }

  try {
    const task = await TaskModel.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => console.log('Server is running on port ' + port));
