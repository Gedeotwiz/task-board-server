import { isRecord } from './common.js';

export function validateCreateMember(
  input: unknown,
):
  | { error: string }
  | { value: { name: string; email: string; phone: string; password: string; color?: string } } {
  if (!isRecord(input) || typeof input.name !== 'string' || !input.name.trim())
    return { error: 'name is required' };
  if (typeof input.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))
    return { error: 'a valid email is required' };
  if (typeof input.phone !== 'string' || !input.phone.trim())
    return { error: 'phone is required' };
  if (typeof input.password !== 'string' || input.password.length < 8)
    return { error: 'password must be at least 8 characters' };
  return {
    value: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      password: input.password,
      ...(typeof input.color === 'string' ? { color: input.color } : {}),
    },
  };
}
