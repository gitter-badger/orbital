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
const __1 = require("../../../../..");
class FooOptions extends __1.Options {
}
__decorate([
    __1.option({
        description: 'Foo description',
        validator: __1.Validation.integer,
    }),
    __metadata("design:type", Number)
], FooOptions.prototype, "foo", void 0);
__decorate([
    __1.option({
        description: 'Bar description',
        validators: [
            __1.Validation.integer,
            __1.Validation.range(10, 20),
        ],
    }),
    __metadata("design:type", Number)
], FooOptions.prototype, "bar", void 0);
exports.FooOptions = FooOptions;
let default_1 = class default_1 extends __1.Command {
    execute(foo, bar, args, options) {
        let data = Object.assign({
            args: [foo, bar, ...args],
        }, options);
        return JSON.stringify(data, undefined, 2);
    }
};
__decorate([
    __param(0, __1.param({
        validator: /yoha/,
    })),
    __param(1, __1.param({
        validators: [
            (value, { name }) => {
                if (value !== 123) {
                    throw new __1.ExpectedError(`Value of ${name} is not valid`);
                }
            },
        ],
    })),
    __param(2, __1.params({
        type: Number,
        validator: __1.Validation.integer,
    })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Array, FooOptions]),
    __metadata("design:returntype", void 0)
], default_1.prototype, "execute", null);
default_1 = __decorate([
    __1.command({
        description: 'Foo bar',
    })
], default_1);
exports.default = default_1;
//# sourceMappingURL=default.js.map