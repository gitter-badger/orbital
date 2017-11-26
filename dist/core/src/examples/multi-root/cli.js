"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const Path = require("path");
const __1 = require("../..");
let cli = new __1.CLI('clime', [
    Path.join(__dirname, 'commands'),
    {
        label: 'Extended subcommands',
        path: 'extra',
    },
]);
let shim = new __1.Shim(cli);
// tslint:disable-next-line:no-floating-promises
shim.execute(process.argv);
//# sourceMappingURL=cli.js.map