import type { NextFunction, Request, Response } from 'express';
import { readDatabase, updateDatabase } from '../models/database.js';
import type { Task } from '../models/types.js';
import { fail } from '../utils/http.js';
import { newId } from '../utils/ids.js';
import {
  validateCreateTask,
  validateTaskPatch,
} from '../validation/task-validation.js';

export async function listTasks(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    res.json((await readDatabase()).tasks);
  } catch (error) {
    next(error);
  }
}

export async function createTask(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const db = await readDatabase();
    const parsed = validateCreateTask(req.body, db);
    if ('error' in parsed) {
      fail(res, 400, parsed.error);
      return;
    }
    const task: Task = { id: newId(), ...parsed.value };
    await updateDatabase((database) => {
      database.tasks.push(task);
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export async function getTask(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const task = (await readDatabase()).tasks.find(
      (item) => item.id === req.params.taskId,
    );
    task ? res.json(task) : fail(res, 404, 'Task not found');
  } catch (error) {
    next(error);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await updateDatabase((db) => {
      const task = db.tasks.find((item) => item.id === req.params.taskId);
      if (!task) return { error: 'Task not found', status: 404 as const };
      const parsed = validateTaskPatch(req.body, db);
      if ('error' in parsed) return parsed;
      Object.assign(task, parsed.value);
      return { task };
    });
    if ('error' in result) {
      fail(res, result.status ?? 400, result.error ?? 'Invalid task data');
      return;
    }
    res.json(result.task);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const deleted = await updateDatabase((db) => {
      const index = db.tasks.findIndex((item) => item.id === req.params.taskId);
      if (index < 0) return false;
      db.tasks.splice(index, 1);
      return true;
    });
    deleted ? res.status(204).end() : fail(res, 404, 'Task not found');
  } catch (error) {
    next(error);
  }
}
