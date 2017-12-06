import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import config from '../../settings';

mongoose.Promise = global.Promise;

if (mongoose.connection.readyState === 0) {
  mongoose.connect(config.db.mongoURI);
  autoIncrement.initialize(mongoose.connection);
}

export default mongoose;
