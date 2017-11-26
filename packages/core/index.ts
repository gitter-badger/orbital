import 'reflect-metadata';

import './lang';

export * from './src/core';
export * from './src/shim';

import * as Castable from './src/castable';
import * as Validation from './src/validation';

export {
  Castable,
  Castable as Object,
  Validation,
};
