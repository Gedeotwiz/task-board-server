import { Router } from 'express';
import { memberRouter } from './member-router.js';
import { taskRouter } from './task-router.js';
import { systemRouter } from './system-router.js';

const router = Router();

router.use('/members', memberRouter);
router.use('/tasks', taskRouter);
router.use('/', systemRouter);

export default router;
