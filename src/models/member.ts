import { model, Schema } from 'mongoose';
import type { Member } from './types.js';

const memberSchema = new Schema<Member>({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  initials: { type: String, required: true },
  color: { type: String, required: true },
  email: { type: String },
  phone: { type: String, trim: true },
  passwordHash: { type: String, select: false },
  passwordResetOtpHash: { type: String, select: false },
  passwordResetOtpExpiresAt: { type: Date, select: false },
}, { versionKey: false });

memberSchema.index({ email: 1 }, { unique: true, sparse: true });

export const MemberModel = model<Member>('Member', memberSchema);
