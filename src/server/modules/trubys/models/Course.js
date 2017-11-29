import { Model } from 'mongoose-model-decorators';

import TrainingVideoSchema from './TrainingVideo';

@Model('courses')
export default class Course {
  static schema = {
    title: String,
    description: String,
    videos: [TrainingVideoSchema],
  };
}
