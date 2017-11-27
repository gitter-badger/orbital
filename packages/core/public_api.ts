import 'reflect-metadata';
import './lang';

import * as Castable from './src/castable';

export * from './src/validation';

export * from './src/cli/cli';
export * from './src/command/index';
export * from './src/help/index';
export * from './src/object/index';
export * from './src/option/index';
export * from './src/param/index';
export * from './src/params/index';
export * from './src/shim/index';
export * from './src/subcommand/index';

export * from './src/error/index';

export {
  Castable,
  Castable as Object,
};
