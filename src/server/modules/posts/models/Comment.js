import { Schema, pre } from 'mongoose-model-decorators';

@Schema()
class Comment {
  static schema = {
    content: String,
  };

  @pre('save')
  log() {
    console.log('hi there');
  }
}

export default new Comment();
