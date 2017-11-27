import * as villa from 'villa';
import * as fs from 'fs';

export async function safeStat(path: string): Promise<fs.Stats | undefined> {
  return await villa.call(fs.stat, path).catch(villa.bear);
}

export async function existsFile(path: string): Promise<boolean> {
  const stats = await safeStat(path);
  return !!stats && stats.isFile();
}

export async function existsDir(path: string): Promise<boolean> {
  const stats = await safeStat(path);
  return !!stats && stats.isDirectory();
}
