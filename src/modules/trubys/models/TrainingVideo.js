import { Schema } from 'mongoose';

export default new Schema({
  title: String,
  description: String,
  videoUrl: String,
  videoContentType: String,
});
