import * as express from 'express';
import * as api from './api/index';
import { errorHandler } from './middleware/error.middleware';
import { notFoundHandler } from './middleware/not-found.middleware';

require('./db/database');

const app = express();
app.use(express.json(), ...api.routers);

app.use(errorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
