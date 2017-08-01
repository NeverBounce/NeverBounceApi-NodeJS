const assert = require('assert'),
    VerificationObject = require('../lib/VerificationObject');

describe('VerificationObject', function () {
    describe('Constructor', function () {
        it('should set response object', function () {
            const resp = {
                result: 'valid',
                flags: [],
                suggested_correction: ''
            };
            const verification = new VerificationObject(resp);
            assert.deepEqual(verification.response, resp);
        });
    });

    describe('getResult/getNumericResult', function () {
        it('return proper response', function () {
            const resp = {
                result: 'valid',
                flags: [],
                suggested_correction: ''
            };
            const verification = new VerificationObject(resp);

            assert.equal(verification.getResult(), 'valid');
            assert.equal(verification.getNumericResult(), 0);
        });
    });

    describe('is', function () {
        it('should return the true when in range, false when out', function () {
            const resp = {
                result: 'valid',
                flags: [],
                suggested_correction: ''
            };
            const verification = new VerificationObject(resp);

            assert.equal(verification.is(0), true);
            assert.equal(verification.is('valid'), true);
            assert.equal(verification.is(VerificationObject.valid), true);
            assert.equal(verification.is(1), false);
            assert.equal(verification.is('invalid'), false);
            assert.equal(verification.is([0, 3, 4]), true);
            assert.equal(verification.is(['valid', 3, 4]), true);
            assert.equal(verification.is([1, 2]), false);
            assert.equal(verification.is(['invalid', 2]), false);
        });
    });

    describe('not', function () {
        it('should return the true when NOT in range, false when in', function () {
            const resp = {
                result: 'valid',
                flags: [],
                suggested_correction: ''
            };
            const verification = new VerificationObject(resp);

            assert.equal(verification.not(0), false);
            assert.equal(verification.not('valid'), false);
            assert.equal(verification.not(VerificationObject.valid), false);
            assert.equal(verification.not(1), true);
            assert.equal(verification.not('invalid'), true);
            assert.equal(verification.not([0, 3, 4]), false);
            assert.equal(verification.not(['valid', 3, 4]), false);
            assert.equal(verification.not([1, 2]), true);
            assert.equal(verification.not(['invalid', 2]), true);
        });
    });

    describe('hasFlag', function () {
        it('should return the true when NOT in range, false when in', function () {
            const resp = {
                result: 'valid',
                flags: ['bad_syntax'],
                suggested_correction: ''
            };
            const verification = new VerificationObject(resp);

            assert.equal(verification.hasFlag('bad_syntax'), true);
            assert.equal(verification.hasFlag('has_dns'), false);
        });
    });
});