import { isRecord } from './common.js';

export function validateCreateMember(
  input: unknown,
):
  | { error: string }
  | { value: { name: string; email?: string; color?: string } } {
  if (!isRecord(input) || typeof input.name !== 'string' || !input.name.trim())
    return { error: 'name is required' };
  return {
    value: {
      name: input.name.trim(),
      ...(typeof input.email === 'string' ? { email: input.email } : {}),
      ...(typeof input.color === 'string' ? { color: input.color } : {}),
    },
  };
}
