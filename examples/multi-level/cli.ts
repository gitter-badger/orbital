import 'source-map-support/register';

import * as Path from 'path';

import { CLI, Shim } from '../../packages/core';

let cli = new CLI('clime', Path.join(__dirname, 'commands'));

let shim = new Shim(cli);
// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
