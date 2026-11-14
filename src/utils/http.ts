import type { Response } from 'express';

export const fail = (res: Response, status: number, message: string) =>
  res.status(status).json({ error: message });
