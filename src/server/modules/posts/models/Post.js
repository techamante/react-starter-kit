import { Model } from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import { withModel } from '../../../helpers/decorators';
import Comment from './Comment';

@withModel({
  collection: 'posts',
  plugins: [[autoIncrement.plugin, 'posts']],
})
export default class Post extends Model {
  static schema = {
    title: { type: String },
    content: String,
    comments: [Comment],
  };
}
