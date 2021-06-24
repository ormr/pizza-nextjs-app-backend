import * as mongoose from 'mongoose';
import { Code } from './code.interface';

const codeSchema = new mongoose.Schema({
  code: String,
  user_id: String,
});

export const codeModel = mongoose.model<Code & mongoose.Document>('Code', codeSchema);