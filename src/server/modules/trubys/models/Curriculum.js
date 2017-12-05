// @flow

import { Schema, Model } from 'mongoose';
import { withModel } from '../../../helpers/decorators';
import Course from './Course';

/* flow-ignore */
@withModel('curriculums')
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
}
