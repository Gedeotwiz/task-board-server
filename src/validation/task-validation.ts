import type { Database, Priority, TaskStatus } from '../models/types.js';
import { isRecord } from './common.js';

const statuses: TaskStatus[] = ['todo', 'progress', 'done'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export function validateCreateTask(
  input: unknown,
  db: Database,
):
  { error: string } | { value: Omit<import('../models/types.js').Task, 'id'> } {
  if (
    !isRecord(input) ||
    typeof input.title !== 'string' ||
    !input.title.trim()
  )
    return { error: 'title is required' };
  const members =
    Array.isArray(input.members) &&
    input.members.every((id) => typeof id === 'string')
      ? (input.members as string[])
      : [];
  if (members.some((id) => !db.members.some((member) => member.id === id)))
    return { error: 'One or more assigned members do not exist' };
  return {
    value: {
      title: input.title.trim(),
      description:
        typeof input.description === 'string' ? input.description : '',
      category:
        typeof input.category === 'string' && input.category
          ? input.category
          : 'General',
      status: statuses.includes(input.status as TaskStatus)
        ? (input.status as TaskStatus)
        : 'todo',
      due: typeof input.due === 'string' ? input.due : '',
      members,
      subtasks:
        Number.isInteger(input.subtasks) && (input.subtasks as number) >= 0
          ? (input.subtasks as number)
          : 0,
      done:
        Number.isInteger(input.done) && (input.done as number) >= 0
          ? (input.done as number)
          : 0,
      priority: priorities.includes(input.priority as Priority)
        ? (input.priority as Priority)
        : 'Medium',
    },
  };
}

export function validateTaskPatch(
  input: unknown,
  db: Database,
): { error: string; status: 400 } | { value: Record<string, unknown> } {
  if (!isRecord(input))
    return { error: 'JSON object body required', status: 400 };
  const value = { ...input };
  for (const key of ['title', 'description', 'category', 'due'] as const)
    if (key in value) {
      if (
        typeof value[key] !== 'string' ||
        (key === 'title' && !value[key].trim())
      )
        return { error: `${key} must be a non-empty string`, status: 400 };
      if (key === 'title') value[key] = value[key].trim();
    }
  if ('status' in value && !statuses.includes(value.status as TaskStatus))
    return { error: 'status must be todo, progress, or done', status: 400 };
  if ('priority' in value && !priorities.includes(value.priority as Priority))
    return { error: 'priority must be Low, Medium, or High', status: 400 };
  for (const key of ['subtasks', 'done'] as const)
    if (
      key in value &&
      (!Number.isInteger(value[key]) || (value[key] as number) < 0)
    )
      return { error: `${key} must be a non-negative integer`, status: 400 };
  if ('members' in value) {
    if (
      !Array.isArray(value.members) ||
      !value.members.every((id) => typeof id === 'string')
    )
      return { error: 'members must be an array of member IDs', status: 400 };
    if (
      (value.members as string[]).some(
        (id) => !db.members.some((member) => member.id === id),
      )
    )
      return {
        error: 'One or more assigned members do not exist',
        status: 400,
      };
    value.members = [...new Set(value.members as string[])];
  }
  return { value };
}

export function isTaskStatus(value: unknown): value is TaskStatus {
  return statuses.includes(value as TaskStatus);
}
export function isPriority(value: unknown): value is Priority {
  return priorities.includes(value as Priority);
}
