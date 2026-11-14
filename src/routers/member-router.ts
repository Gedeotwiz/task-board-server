import { Router } from 'express';
import {
  createMember,
  deleteMember,
  listMembers,
} from '../controllers/member-controller.js';
import { login, requestPasswordOtp, verifyOtpAndResetPassword } from '../controllers/auth-controller.js';

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
 *             required: [name, phone, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
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
memberRouter.post('/login', login);
memberRouter.post('/forgot-password', requestPasswordOtp);
memberRouter.post('/verify-otp', verifyOtpAndResetPassword);

/** @openapi
 * /api/members/login:
 *   post:
 *     summary: Log in a member with email and password
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Signed in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token: { type: string }
 *       401: { description: Invalid credentials }
 */
/** @openapi
 * /api/members/forgot-password:
 *   post:
 *     summary: Send a password reset OTP to the member email
 *     tags: [Members]
 *     responses: { 200: { description: Reset code sent when the account exists }, 503: { description: Email delivery unavailable } }
 */
/** @openapi
 * /api/members/verify-otp:
 *   post:
 *     summary: Verify a reset OTP and set a new password
 *     tags: [Members]
 *     responses: { 200: { description: Password reset }, 400: { description: Invalid or expired OTP } }
 */

/** @openapi
 * /api/members/{memberId}:
 *   delete:
 *     summary: Remove a member and unassign them from their tasks
 *     tags: [Members]
 *     parameters: [{ in: path, name: memberId, required: true, schema: { type: string } }]
 *     responses: { 204: { description: Member deleted and assignments removed }, 404: { description: Member not found } }
 */
memberRouter.delete('/:memberId', deleteMember);
