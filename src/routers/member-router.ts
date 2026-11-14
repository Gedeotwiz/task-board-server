import { Router } from 'express';
import {
  createMember,
  deleteMember,
  listMembers,
} from '../controllers/member-controller.js';

export const memberRouter = Router();

/** @openapi
 * /api/members:
 *   get:
 *     summary: List members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: Member list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Member'
 *   post:
 *     summary: Add a member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member created
 *       400:
 *         description: Invalid member data
 */
memberRouter.get('/', listMembers);
memberRouter.post('/', createMember);

/** @openapi
 * /api/members/{memberId}:
 *   delete:
 *     summary: Remove a member and unassign them from their tasks
 *     tags: [Members]
 *     parameters: [{ in: path, name: memberId, required: true, schema: { type: string } }]
 *     responses: { 204: { description: Member deleted and assignments removed }, 404: { description: Member not found } }
 */
memberRouter.delete('/:memberId', deleteMember);
