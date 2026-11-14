import { model, Schema } from 'mongoose';
import type { Member } from './types.js';

const memberSchema = new Schema<Member>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  initials: { type: String, required: true },
  color: { type: String, required: true },
  email: { type: String },
}, { versionKey: false });

export const MemberModel = model<Member>('Member', memberSchema);
