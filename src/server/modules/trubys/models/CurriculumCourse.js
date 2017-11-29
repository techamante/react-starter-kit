import { Schema } from 'mongoose';

export default new Schema({
  courseId: { type: Schema.Types.ObjectId, ref: 'Courses' },
});
