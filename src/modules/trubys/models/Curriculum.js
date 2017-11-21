import mongoose from 'mongoose';
import CurriculumCourseSchema from './CurriculumCourse';

const { Schema } = mongoose;

const curriculumSchema = new Schema({
  title: String,
  description: String,
  courses: [CurriculumCourseSchema],
});

mongoose.model('Curriculums', curriculumSchema);
