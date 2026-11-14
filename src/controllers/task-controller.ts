import type { NextFunction, Request, Response } from 'express';
import { MemberModel } from '../models/member.js';
import { TaskModel } from '../models/task.js';
import { fail } from '../utils/http.js';
import { newId } from '../utils/ids.js';
import { validateCreateTask, validateTaskPatch } from '../validation/task-validation.js';

async function getMemberIds(): Promise<Set<string>> {
  const members = await MemberModel.find().select('id -_id').lean().exec();
  return new Set(members.map((member) => member.id));
}

export async function listTasks(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const tasks = await TaskModel.find().select('-_id').lean().exec();
    res.json(tasks);
  } catch (error) { next(error); }
}

export async function createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = validateCreateTask(req.body, await getMemberIds());
    if ('error' in parsed) { fail(res, 400, parsed.error); return; }
    const task = await TaskModel.create({ id: newId(), ...parsed.value });
    const { _id, ...apiTask } = task.toObject();
    res.status(201).json(apiTask);
  } catch (error) { next(error); }
}

export async function getTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const task = await TaskModel.findOne({ id: req.params.taskId }).select('-_id').lean().exec();
    task ? res.json(task) : fail(res, 404, 'Task not found');
  } catch (error) { next(error); }
}

export async function updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const memberIds = await getMemberIds();
    const parsed = validateTaskPatch(req.body, memberIds);
    if ('error' in parsed) { fail(res, parsed.status, parsed.error); return; }
    const task = await TaskModel.findOneAndUpdate(
      { id: req.params.taskId },
      { $set: parsed.value },
      { new: true, runValidators: true },
    ).select('-_id').lean().exec();
    task ? res.json(task) : fail(res, 404, 'Task not found');
  } catch (error) { next(error); }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const deleted = await TaskModel.findOneAndDelete({ id: req.params.taskId }).exec();
    deleted ? res.status(204).end() : fail(res, 404, 'Task not found');
  } catch (error) { next(error); }
}
