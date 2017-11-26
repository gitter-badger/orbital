#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const __1 = require("../../../..");
let cli = new __1.CLI('multi-root', [
    Path.join(__dirname, 'commands'),
    {
        label: 'Extra Subcommands',
        path: Path.join(__dirname, 'extra-commands'),
    },
    {
        label: 'Extra Subcommands',
        path: Path.join(__dirname, 'extra-extra-commands'),
    },
]);
let shim = new __1.Shim(cli);
// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
//# sourceMappingURL=cli.js.map