import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Database } from './types.js';

const dataPath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'data.json',
);
let queue = Promise.resolve();

const emptyDatabase = (): Database => ({ members: [], tasks: [] });

export async function readDatabase(): Promise<Database> {
  try {
    return JSON.parse(await readFile(dataPath, 'utf8')) as Database;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT')
      return emptyDatabase();
    throw error;
  }
}

export async function updateDatabase<T>(
  change: (db: Database) => T | Promise<T>,
): Promise<T> {
  let result!: T;
  const operation = queue.then(async () => {
    const db = await readDatabase();
    result = await change(db);
    await writeFile(dataPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8');
  });
  queue = operation.catch(() => undefined);
  await operation;
  return result;
}
