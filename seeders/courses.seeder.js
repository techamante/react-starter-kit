import { Seeder } from 'mongoose-data-seed';
import { Course, Curriculum } from '../src/modules/trubys/models';

const data = [
  {
    title: 'Course #1',
    description: 'First Course',
  },
  {
    title: 'Course #2',
    description: 'Second Course',
  },
];

class CoursesSeeder extends Seeder {
  async beforeRun() {
    this.curriculums = await Curriculum.find({}).exec();
  }

  async shouldRun() {
    return Course.count()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    const results = [];
    const courses = await Course.create(data);

    for (const curriculum of this.curriculums) {
      console.log(curriculum);
      for (const course of courses) {
        console.log(course);
        curriculum.courses.push(course);
        results.push(curriculum.save());
      }
    }

    return Promise.all(results);
  }
}

export default CoursesSeeder;
