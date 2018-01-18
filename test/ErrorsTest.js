const assert = require('chai').assert,
    _Errors = require('../src/Errors');

describe('Errors', function () {

    /**
     * @since 4.1.4
     */
    describe('backward compat', function () {
        it('should expose error helpers from Errors Object', function () {
            assert.hasAllKeys(_Errors, [
                'AuthError',
                'BadReferrerError',
                'GeneralError',
                'ThrottleError',
                '_lut'
            ]);
        });
    });
});