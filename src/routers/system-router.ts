import { Router } from 'express';
import { health } from '../controllers/system-controller.js';

export const systemRouter = Router();

/** @openapi
 * /api/health:
 *   get:
 *     summary: Check that the API is running
 *     tags: [System]
 *     responses:
 *       200: { description: API is healthy }
 */
systemRouter.get('/health', health);
