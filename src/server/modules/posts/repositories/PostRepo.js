// @flow

import { Post } from '../models';

export default class PostRepo {
  static async listOfPosts(limit: number, after: number): Promise<Post> {
    let query = Post.find({}).sort('id');
    if (after > 0) {
      query = query.where('_id').gt(after);
    }
    return query.limit(limit);
  }
}
