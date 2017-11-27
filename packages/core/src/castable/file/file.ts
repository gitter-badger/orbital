import * as fs from 'fs';
import * as path from 'path';
import * as villa from 'villa';

import { CastingContext } from '../../object/casting-context';
import { ExpectedError } from '../../error';

export class File {
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

  require<T>(): T {
    try {
      return require(this.fullName);
    } catch (error) {
      throw new ExpectedError(`Error requiring file "${this.source}"`);
    }
  }

  async buffer(): Promise<Buffer> {
    await this.assert();
    return villa.call<Buffer>(fs.readFile, this.fullName);
  }

  async text(encoding = 'utf-8'): Promise<string> {
    await this.assert();
    return villa.call<string>(fs.readFile, this.fullName, encoding);
  }

  async json<T>(encoding?: string): Promise<T> {
    let json = await this.text(encoding);
    return JSON.parse(json);
  }

  async assert(exists = true): Promise<void> {
    let stats = await villa.call(fs.stat, this.fullName).catch(villa.bear);

    if (exists) {
      if (!stats) {
        throw new ExpectedError(`File "${this.source}" does not exist`);
      }

      if (!stats.isFile()) {
        throw new ExpectedError(`Object "${this.source}" is expected to be a file`);
      }
    } else if (stats) {
      throw new ExpectedError(`Object "${this.source}" already exists`);
    }
  }

  async exists(): Promise<boolean>;
  async exists(extensions: string[]): Promise<string | undefined>;
  async exists(extensions?: string[]): Promise<boolean | string | undefined> {
    let extensionsSpecified = !!extensions;

    for (let extension of extensions || ['']) {
      let path = this.fullName + extension;
      let stats = await villa.call(fs.stat, path).catch(villa.bear);

      if (stats && stats.isFile()) {
        return extensionsSpecified ? path : true;
      }
    }

    return extensionsSpecified ? undefined : false;
  }

  static cast(name: string, context: CastingContext<File>): File {
    return new this(name, context.cwd, context.default);
  }
}
