import type { NextFunction, Request, Response } from 'express';
import { MemberModel } from '../models/member.js';
import { TaskModel } from '../models/task.js';
import { fail } from '../utils/http.js';
import { newId } from '../utils/ids.js';
import { validateCreateMember } from '../validation/member-validation.js';

const colors = ['#7657e8', '#e88762', '#39a98b', '#5080df', '#ca6594'];

export async function listMembers(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const members = await MemberModel.find().select('-_id').lean().exec();
    res.json(members);
  } catch (error) { next(error); }
}

export async function createMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = validateCreateMember(req.body);
    if ('error' in parsed) { fail(res, 400, parsed.error); return; }
    const { name, email, color } = parsed.value;
    const memberCount = await MemberModel.countDocuments();
    const member = await MemberModel.create({
      id: newId(),
      name,
      initials: name.split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase(),
      color: color ?? colors[memberCount % colors.length],
      ...(email === undefined ? {} : { email }),
    });
    const { _id, ...apiMember } = member.toObject();
    res.status(201).json(apiMember);
  } catch (error) { next(error); }
}

export async function deleteMember(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await MemberModel.findOneAndDelete({ id: req.params.memberId }).exec();
    if (!deleted) { fail(res, 404, 'Member not found'); return; }
    await TaskModel.updateMany({ members: req.params.memberId }, { $pull: { members: req.params.memberId } }).exec();
    res.status(204).end();
  } catch (error) { next(error); }
}
