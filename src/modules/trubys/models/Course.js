import mongoose from 'mongoose';
import TrainingVideoSchema from './TrainingVideo';

const { Schema } = mongoose;
const courseScheme = new Schema({
  title: String,
  description: String,
  videos: [TrainingVideoSchema],
});

export default mongoose.model('courses', courseScheme);
