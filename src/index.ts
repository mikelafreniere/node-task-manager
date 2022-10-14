import * as express from 'express';
import * as users_api from './api/users';
import * as tasks_api from './api/tasks';

require('./db/database');

const app = express();
app.use(express.json());

users_api.register(app);
tasks_api.register(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Server is running on port ' + port));
