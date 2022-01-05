import { connect } from 'mongoose';
import { TaskModel } from './db/task';
import { UserModel } from './db/user';

connect('mongodb://127.0.0.1:27017/task-manager');

// const me = new UserModel({ email: 'Mike@', name: 'Mike' });
// me.save().then(console.log).catch(console.log);
