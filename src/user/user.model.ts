import * as mongoose from 'mongoose';
import { User } from './user.interface';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  password: String,
  activated: Boolean
});

export const userModel = mongoose.model<User & mongoose.Document>('User', userSchema)