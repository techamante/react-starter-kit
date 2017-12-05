// @flow

import { Curriculum, Course } from '../models';

export default class CurriculumRepo {
  static async findByIdWithCourses(id: string): Promise<Course> {
    return Curriculum.findById(id).populate('courses');
  }
}
