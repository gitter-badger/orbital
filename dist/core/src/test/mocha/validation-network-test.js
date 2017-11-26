"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_1 = require("../../validation/network");
describe('Network related validators', () => {
    it('validator `ip` should work', () => {
        network_1.ip('127.0.0.1', { name: 'test', source: '127.0.0.1' });
        network_1.ip('::1', { name: 'test', source: '::1' });
        (() => network_1.ip('abc', { name: 'test', source: 'abc' }))
            .should.throw('Value (abc) of "test" is not a valid IP address');
    });
    it('validator `ipv4` should work', () => {
        network_1.ipv4('127.0.0.1', { name: 'test', source: '127.0.0.1' });
        (() => network_1.ipv4('abc', { name: 'test', source: 'abc' }))
            .should.throw('Value (abc) of "test" is not a valid IPv4 address');
        (() => network_1.ipv4('::1', { name: 'test', source: '::1' }))
            .should.throw('Value (::1) of "test" is not a valid IPv4 address');
    });
    it('validator `ipv6` should work', () => {
        network_1.ipv6('::1', { name: 'test', source: '::1' });
        (() => network_1.ipv6('abc', { name: 'test', source: 'abc' }))
            .should.throw('Value (abc) of "test" is not a valid IPv6 address');
        (() => network_1.ipv6('127.0.0.1', { name: 'test', source: '127.0.0.1' }))
            .should.throw('Value (127.0.0.1) of "test" is not a valid IPv6 address');
    });
});
//# sourceMappingURL=validation-network-test.js.map