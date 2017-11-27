import * as fs from 'fs';
import * as villa from 'villa';

export async function safeStat(path: string): Promise<fs.Stats | undefined> {
  return await villa.call(fs.stat, path).catch(villa.bear);
}

export async function existsFile(path: string): Promise<boolean> {
  let stats = await safeStat(path);
  return !!stats && stats.isFile();
}

export async function existsDir(path: string): Promise<boolean> {
  let stats = await safeStat(path);
  return !!stats && stats.isDirectory();
}
