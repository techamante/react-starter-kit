import { Seeder } from 'mongoose-data-seed';
import { Curriculum } from '../src/modules/trubys/models';

const data = [
  {
    title: 'Hello World',
    description: 'Hi there',
  },
];

class CurriculumsSeeder extends Seeder {
  async shouldRun() {
    return Curriculum.count()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return Curriculum.create(data);
  }
}

export default CurriculumsSeeder;
