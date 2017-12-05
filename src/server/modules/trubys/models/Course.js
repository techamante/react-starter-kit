import { Model } from 'mongoose';
import { withModel } from '../../../helpers/decorators';
import TrainingVideoSchema from './TrainingVideo';

@withModel('courses')
export default class Course extends Model {
  static schema = {
    title: String,
    description: String,
    videos: [TrainingVideoSchema],
  };
}
