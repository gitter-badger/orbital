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
const __1 = require("../..");
const array_1 = require("../../castable/array");
const context = new __1.Context({
    cwd: __dirname,
    commands: ['clime'],
});
class CastableFoo {
    constructor(source) {
        this.source = source;
    }
    static cast(source, context) {
        return new CastableFoo(source);
    }
}
class Bar {
    constructor(source) {
        this.source = source;
    }
}
const CastableBar = {
    cast(source, context) {
        return new Bar(source);
    },
};
describe('Castable array', () => {
    it('should cast primitive values', () => __awaiter(this, void 0, void 0, function* () {
        let castingContext = __1.buildCastingContext(context, {
            name: 'test',
            validators: [],
            default: false,
        });
        yield __1.cast('foo, bar', array_1.array(String), castingContext)
            .should.eventually.deep.equal(['foo', 'bar']);
        yield __1.cast('123, 456', array_1.array(Number), castingContext)
            .should.eventually.deep.equal([123, 456]);
        yield __1.cast('true, false', array_1.array(Boolean), castingContext)
            .should.eventually.deep.equal([true, false]);
    }));
    it('should cast string-castable values', () => __awaiter(this, void 0, void 0, function* () {
        let castingContext = __1.buildCastingContext(context, {
            name: 'test',
            validators: [],
            default: false,
        });
        yield __1.cast('yo, ha', array_1.array(CastableFoo), castingContext)
            .should.eventually.deep.equal([
            { source: 'yo' },
            { source: 'ha' },
        ]);
        yield __1.cast('yo, ha', array_1.array(CastableBar), castingContext)
            .should.eventually.deep.equal([
            { source: 'yo' },
            { source: 'ha' },
        ]);
    }));
    it('should cast nested array values', () => __awaiter(this, void 0, void 0, function* () {
        let castingContext = __1.buildCastingContext(context, {
            name: 'test',
            validators: [],
            default: false,
        });
        let type = array_1.array(array_1.array(String, { trim: false, empty: true }), { separator: ';' });
        yield __1.cast('yo,, ha ; biu, pia', type, castingContext)
            .should.eventually.deep.equal([
            ['yo', '', ' ha'],
            ['biu', ' pia'],
        ]);
    }));
    it('should validate array values', () => __awaiter(this, void 0, void 0, function* () {
        let castingContext = __1.buildCastingContext(context, {
            name: 'test',
            validators: [],
            default: false,
        });
        let typeA = array_1.array(Number, {
            validators: [__1.Validation.integer, __1.Validation.range(10, 20)],
        });
        yield __1.cast('1, 15', typeA, castingContext)
            .should.be.rejectedWith('Value (1) of "element of test" is not within the range of [10, 20)');
        yield __1.cast('10, 15.5', typeA, castingContext)
            .should.be.rejectedWith('Value (15.5) of "element of test" is not an integer');
        let typeB = array_1.array(Number, {
            validator: /^1\d$/,
        });
        yield __1.cast('11, 22, 13', typeB, castingContext)
            .should.be.rejectedWith('Invalid value for "element of test"');
    }));
});
//# sourceMappingURL=castable-array-test.js.map