"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const miscellaneous_1 = require("../../castable/miscellaneous");
describe('Castable object `CommaSeparatedStrings`', () => {
    it('should cast', () => {
        miscellaneous_1.CommaSeparatedStrings.cast('foo, bar').should.deep.equal(['foo', 'bar']);
        miscellaneous_1.CommaSeparatedStrings.cast('foo, bar, , pia').should.deep.equal(['foo', 'bar', 'pia']);
    });
});
describe('Castable object `CastableDate`', () => {
    it('should cast', () => {
        let casted = miscellaneous_1.CastableDate.cast('2013-12-15');
        casted.getTime().should.equal(new Date(2013, 11, 15).getTime());
        let date = casted.toDate();
        date.getTime().should.equal(new Date(2013, 11, 15).getTime());
        date.constructor.should.equal(Date);
    });
});
//# sourceMappingURL=castable-miscellaneous-test.js.map