import * as fs from 'fs';
import * as path from 'path';
import * as villa from 'villa';

import { CastingContext } from '../../object/casting-context';
import { ExpectedError } from '../../error';

export class Directory {
  readonly baseName: string;
  readonly fullName: string;
  readonly default: boolean;

  private constructor(
    public readonly source: string,
    public readonly cwd: string,
    usingDefault: boolean,
  ) {
    this.baseName = path.basename(source);
    this.fullName = path.resolve(cwd, source);
    this.default = usingDefault;
  }

  async assert(exists = true): Promise<void> {
    let stats = await villa.call(fs.stat, this.fullName).catch(villa.bear);

    if (exists) {
      if (!stats) {
        throw new ExpectedError(`Directory "${this.source}" does not exist`);
      }

      if (!stats.isDirectory()) {
        throw new ExpectedError(`Object "${this.source}" is expected to be a directory`);
      }
    } else if (stats) {
      throw new ExpectedError(`Object "${this.source}" already exists`);
    }
  }

  async exists(): Promise<boolean> {
    const stats = await villa.call(fs.stat, this.fullName).catch(villa.bear);
    return !!stats && stats.isDirectory();
  }

  static cast(name: string, context: CastingContext<Directory>): Directory {
    return new this(name, context.cwd, context.default);
  }
}
