import mongoose from 'mongoose';
import CurriculumCourseSchema from './CurriculumCourse';

const { Schema } = mongoose;

const curriculumSchema = new Schema({
  title: String,
  description: String,
  courses: [{ type: Schema.Types.ObjectId, ref: 'courses' }],
});

export default mongoose.model('curriculums', curriculumSchema);
