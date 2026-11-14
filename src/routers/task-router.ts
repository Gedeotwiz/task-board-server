import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTask,
  listTasks,
  updateTask,
} from '../controllers/task-controller.js';

export const taskRouter = Router();

/** @openapi
 * /api/tasks:
 *   get:
 *     summary: List tasks
 *     tags: [Tasks]
 *     responses:
 *       200: { description: Task list, content: { application/json: { schema: { type: array, items: { $ref: '#/components/schemas/Task' } } } } }
 *   post:
 *     summary: Create a task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content: { application/json: { schema: { type: object, required: [title], properties: { title: { type: string }, description: { type: string }, category: { type: string }, status: { type: string, enum: [todo, progress, done] }, due: { type: string }, members: { type: array, items: { type: string } }, subtasks: { type: integer }, done: { type: integer }, priority: { type: string, enum: [Low, Medium, High] } } } } }
 *     responses:
 *       201: { description: Task created }
 *       400: { description: Invalid task data }
 */
taskRouter.get('/', listTasks);
taskRouter.post('/', createTask);

/** @openapi
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get a task
 *     tags: [Tasks]
 *     parameters: [{ in: path, name: taskId, required: true, schema: { type: string } }]
 *     responses: { 200: { description: Task found }, 404: { description: Task not found } }
 *   patch:
 *     summary: Update task fields, including assignment or status
 *     tags: [Tasks]
 *     parameters: [{ in: path, name: taskId, required: true, schema: { type: string } }]
 *     requestBody: { required: true, content: { application/json: { schema: { type: object } } } }
 *     responses: { 200: { description: Task updated }, 400: { description: Invalid fields }, 404: { description: Task not found } }
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     parameters: [{ in: path, name: taskId, required: true, schema: { type: string } }]
 *     responses: { 204: { description: Task deleted }, 404: { description: Task not found } }
 */
taskRouter.get('/:taskId', getTask);
taskRouter.patch('/:taskId', updateTask);
taskRouter.delete('/:taskId', deleteTask);
