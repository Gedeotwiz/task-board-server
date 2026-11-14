import { randomInt } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { MemberModel } from '../models/member.js';
import { fail } from '../utils/http.js';
import { createAccessToken, hashOtp, hashSecret, verifySecret } from '../utils/secrets.js';

function emailFrom(input: unknown): string | undefined {
  if (!input || typeof input !== 'object' || !('email' in input) || typeof input.email !== 'string') return;
  const email = input.email.trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined;
}

async function deliverOtp(email: string, otp: string): Promise<boolean> {
  const endpoint = process.env.EMAIL_API_URL;
  if (!endpoint) return false;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(process.env.EMAIL_API_KEY ? { authorization: `Bearer ${process.env.EMAIL_API_KEY}` } : {}),
    },
    body: JSON.stringify({ to: email, subject: 'TaskBoard password reset code', text: `Your password reset code is ${otp}. It expires in 10 minutes.` }),
  });
  return response.ok;
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = emailFrom(req.body);
    const password = req.body && typeof req.body === 'object' && 'password' in req.body ? req.body.password : undefined;
    if (!email || typeof password !== 'string') { fail(res, 400, 'valid email and password are required'); return; }
    const member = await MemberModel.findOne({ email }).select('+passwordHash').exec();
    if (!member?.passwordHash || !(await verifySecret(password, member.passwordHash))) {
      fail(res, 401, 'Invalid email or password'); return;
    }
    res.json({ token: createAccessToken(member.id) });
  } catch (error) { next(error); }
}

export async function requestPasswordOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = emailFrom(req.body);
    if (!email) { fail(res, 400, 'valid email is required'); return; }
    const member = await MemberModel.findOne({ email }).exec();
    if (member) {
      const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
      const delivered = await deliverOtp(email, otp);
      if (!delivered) { fail(res, 503, 'Email delivery is not configured or failed'); return; }
      member.set({ passwordResetOtpHash: hashOtp(otp), passwordResetOtpExpiresAt: new Date(Date.now() + 10 * 60_000) });
      await member.save();
    }
    res.json({ message: 'If an account exists for this email, a reset code has been sent.' });
  } catch (error) { next(error); }
}

export async function verifyOtpAndResetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email = emailFrom(req.body);
    const { otp, newPassword } = req.body ?? {};
    if (!email || typeof otp !== 'string' || !/^\d{6}$/.test(otp) || typeof newPassword !== 'string' || newPassword.length < 8) {
      fail(res, 400, 'valid email, 6 digit otp, and newPassword (at least 8 characters) are required'); return;
    }
    const member = await MemberModel.findOne({ email }).select('+passwordResetOtpHash +passwordResetOtpExpiresAt').exec();
    if (!member?.passwordResetOtpHash || !member.passwordResetOtpExpiresAt || member.passwordResetOtpExpiresAt.getTime() < Date.now() || hashOtp(otp) !== member.passwordResetOtpHash) {
      fail(res, 400, 'Invalid or expired reset code'); return;
    }
    member.set({ passwordHash: await hashSecret(newPassword), passwordResetOtpHash: undefined, passwordResetOtpExpiresAt: undefined });
    await member.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) { next(error); }
}
