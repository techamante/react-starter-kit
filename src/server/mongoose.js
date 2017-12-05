import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
export default config => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(config.db.mongoURI);
  }

  return mongoose;
};
