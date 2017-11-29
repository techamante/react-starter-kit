// @flow

import { Schema, Model } from 'mongoose';
import { Model as model } from 'mongoose-model-decorators';
import Course from './Course';

/* flow-ignore */
@model('curriculums')
/* flow-ignore */
export default class Curriculum extends Model {
  static schema = {
    title: String,
    description: String,
    courses: [{ type: Schema.Types.ObjectId, ref: 'courses' }],
  };

  async addCourse(course: Course) {
    this.courses.push(course);
    await this.save();
  }

  static async findByIdWithCourses(id: string): Promise<Course> {
    return this.findById(id).populate('courses');
  }
}
