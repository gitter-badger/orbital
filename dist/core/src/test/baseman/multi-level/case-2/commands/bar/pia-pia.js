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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../../../../../..");
class PiaPiaOptions extends __1.Options {
}
__decorate([
    __1.option({
        description: 'Useless name',
        flag: 'n',
    }),
    __metadata("design:type", String)
], PiaPiaOptions.prototype, "name", void 0);
__decorate([
    __1.option({
        description: 'Useless switch',
        flag: 's',
        toggle: true,
    }),
    __metadata("design:type", Boolean)
], PiaPiaOptions.prototype, "switch", void 0);
exports.PiaPiaOptions = PiaPiaOptions;
let default_1 = class default_1 extends __1.Command {
    execute(options) {
        return JSON.stringify(options, undefined, 2);
    }
};
__decorate([
    __1.metadata,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PiaPiaOptions]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    __1.command({
        brief: 'Pia',
        description: 'Pia pia description',
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=pia-pia.js.map