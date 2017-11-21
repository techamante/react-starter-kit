import mongoose from 'mongoose';
import TrainingVideoSchema from './TrainingVideo';

const { Schema } = mongoose;
const courseScheme = new Schema({
  title: String,
  description: String,
  videos: [TrainingVideoSchema],
});

mongoose.model('courses', courseScheme);
