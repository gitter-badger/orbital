"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const __1 = require("../../..");
// tslint:disable-next-line:no-unbound-method
const hasOwnProperty = Object.prototype.hasOwnProperty;
const messageMap = {
    en: 'Hello, {name}!',
    zh: '你好, {name}!',
};
class GreetingOptions extends __1.Options {
}
__decorate([
    __1.option({
        flag: 'l',
        default: 'en',
        description: 'Language of greeting message',
    }),
    __metadata("design:type", String)
], GreetingOptions.prototype, "lang", void 0);
exports.GreetingOptions = GreetingOptions;
let default_1 = class default_1 extends __1.Command {
    execute(name, options) {
        let lang = options.lang;
        if (hasOwnProperty.call(messageMap, lang)) {
            return messageMap[lang].replace('{name}', name);
        }
        else {
            throw new __1.ExpectedError(`Language "${lang}" is not supported`);
        }
    }
};
__decorate([
    __param(0, __1.param({
        name: 'yourName',
        required: true,
        description: 'Your loud name',
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, GreetingOptions]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    __1.command({
        description: 'This is a command that prints greeting message',
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=default.js.map