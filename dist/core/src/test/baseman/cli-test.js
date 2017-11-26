"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const glob = require("glob");
const v = require("villa");
const baseman_1 = require("baseman");
class ClimeCLITestCase extends baseman_1.CLITestCase {
    get description() {
        let argsStr = this.args.slice(1).map(arg => JSON.stringify(arg)).join(' ');
        return `args ${argsStr}`;
    }
    extractOutput(stdout, stderr) {
        let out = stdout.toString();
        let err = stderr.toString();
        let blurPathOptions = {
            extensions: ['.js'],
            existingOnly: true,
        };
        out = baseman_1.Util.blurPath(out, blurPathOptions);
        err = baseman_1.Util.blurErrorStack(err);
        err = baseman_1.Util.blurPath(err, blurPathOptions);
        return [out, err];
    }
}
exports.ClimeCLITestCase = ClimeCLITestCase;
class ClimeCLITest extends baseman_1.CLITest {
    generate() {
        return __awaiter(this, void 0, void 0, function* () {
            let caseNames = yield v.call(glob, '*/case-*/', {
                cwd: __dirname,
            });
            return caseNames.map(caseName => {
                if (!/-\d+\/$/.test(caseName)) {
                    throw new Error(`Expecting numeric suffix for case name "${caseName}"`);
                }
                let caseDir = Path.join(__dirname, caseName);
                let subcases = require(Path.join(caseDir, 'subcases')).default;
                return subcases.map(subcase => {
                    return new ClimeCLITestCase(`${caseName}${subcase.name}`, [Path.join(caseDir, 'cli.js')].concat(subcase.args));
                });
            })
                .reduce((result, cases) => result.concat(cases), []);
        });
    }
}
exports.ClimeCLITest = ClimeCLITest;
exports.default = new ClimeCLITest('node');
//# sourceMappingURL=cli-test.js.map