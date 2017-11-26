#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const __1 = require("../../../..");
let cli = new __1.CLI('invalid-usage', Path.join(__dirname, 'commands'));
let shim = new __1.Shim(cli);
// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
//# sourceMappingURL=cli.js.map