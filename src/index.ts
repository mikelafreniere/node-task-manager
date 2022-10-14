import * as express from 'express';
import * as api from './api/index';

require('./db/database');

const app = express();
app.use(express.json(), ...api.routers);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
