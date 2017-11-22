import { Model } from 'mongoose';
import { Model as model } from 'mongoose-model-decorators';
import bcrypt from 'bcryptjs';
@model('users')
export default class User extends Model {
  static schema = {
    username: { type: String, required: true, index: true },
    role: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    password: String,
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },
    profile: {
      firstName: String,
      lastName: String,
    },
    facebook: {
      facebookId: String,
      displayName: String,
    },
  };

  async register() {
    this.password = await bcrypt.hash(this.password, 12);
    return this.save();
  }

  static async getUserByUserName(userName) {
    return this.findOne({ userName });
  }
}
