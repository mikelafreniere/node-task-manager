import * as express from 'express';
import * as mongoose from 'mongoose';
import { TaskModel } from './models/task';
import { UserModel } from './models/user';

require('./db/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Endpoints
app.post('/users', (req, res) => {
  const newUser = new UserModel(req.body);
  newUser
    .save()
    .then((user) => res.status(201).send(user.toJSON()))
    .catch((err) => res.status(400).send(err));
});

app.get('/users', (req, res) => {
  UserModel.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(500).send('Unable to list users'));
});

app.get('/users/:id', (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send();
    return;
  }
  UserModel.findById(_id)
    .then((user) => {
      if (!user) {
        res.status(404).send();
      }
      res.status(200).send(user);
    })
    .catch((err) => res.status(500).send(err));
});

app.post('/tasks', (req, res) => {
  const newTask = new TaskModel(req.body);
  newTask
    .save()
    .then((task) => res.status(201).send(task.toJSON()))
    .catch((err) => res.status(400).send(err));
});

app.get('/tasks', (req, res) => {
  TaskModel.find({})
    .then((tasks) => res.status(200).send(tasks))
    .catch(() => res.status(500).send('Unable to list tasks'));
});

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send();
    return;
  }
  TaskModel.findById(_id)
    .then((task) => {
      if (!task) {
        res.status(404).send();
      }
      res.status(200).send(task);
    })
    .catch((err) => res.status(500).send(err));
});

app.listen(port, () => console.log('Server is running on port ' + port));
