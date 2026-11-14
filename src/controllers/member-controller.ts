import type { NextFunction, Request, Response } from 'express';
import { readDatabase, updateDatabase } from '../models/database.js';
import type { Member } from '../models/types.js';
import { fail } from '../utils/http.js';
import { newId } from '../utils/ids.js';
import { validateCreateMember } from '../validation/member-validation.js';

const colors = ['#7657e8', '#e88762', '#39a98b', '#5080df', '#ca6594'];

export async function listMembers(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json((await readDatabase()).members);
  } catch (error) {
    next(error);
  }
}

export async function createMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsed = validateCreateMember(req.body);
    if ('error' in parsed) {
      fail(res, 400, parsed.error);
      return;
    }
    const db = await readDatabase();
    const { name, email, color } = parsed.value;
    const member: Member = {
      id: newId(),
      name,
      initials: name
        .split(/\s+/)
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      color: color ?? colors[db.members.length % colors.length],
      ...(email === undefined ? {} : { email }),
    };
    await updateDatabase((database) => {
      database.members.push(member);
    });
    res.status(201).json(member);
  } catch (error) {
    next(error);
  }
}

export async function deleteMember(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const deleted = await updateDatabase((db) => {
      const index = db.members.findIndex(
        (member) => member.id === req.params.memberId,
      );
      if (index < 0) return false;
      db.members.splice(index, 1);
      db.tasks.forEach((task) => {
        task.members = task.members.filter((id) => id !== req.params.memberId);
      });
      return true;
    });
    deleted ? res.status(204).end() : fail(res, 404, 'Member not found');
  } catch (error) {
    next(error);
  }
}
