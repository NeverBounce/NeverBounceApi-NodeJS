'use strict';

class VerificationObject {

    constructor (response) {
        this.response = response;
    }

    /**
     * Returns result
     * @returns {Object}
     */
    getResult() {
        return this.response.result;
    }

    /**
     * Returns text code
     * @returns {*}
     */
    getNumericResult() {
        return VerificationObject.numericCodes[this.getResult()];
    }

    /**
     * Returns true if result is of specified types
     * @param codes
     * @returns {boolean}
     */
    is(codes) {
        if(Array.isArray(codes)) {
            return (codes.indexOf(this.getResult()) > -1 || codes.indexOf(this.getNumericResult()) > -1);
        } else {
            return (codes === this.getResult() || codes === this.getNumericResult());
        }
    }

    /**
     * Returns true if result is NOT of specified types
     * @param codes
     * @returns {boolean}
     */
    not(codes) {
        if(Array.isArray(codes)) {
            return (codes.indexOf(this.getResult()) === -1 && codes.indexOf(this.getNumericResult()) === -1);
        } else {
            return (codes !== this.getResult() && codes !== this.getNumericResult());
        }
    }

    /**
     * Returns true if the flag was returned
     * @param flag
     * @returns {boolean}
     */
    hasFlag(flag) {
        return this.response
            && this.response.flags
            && this.response.flags.indexOf(flag) > -1;
    }
}

VerificationObject.valid = 0;
VerificationObject.invalid = 1;
VerificationObject.disposable = 2;
VerificationObject.catchall = 3;
VerificationObject.unknown = 4;

VerificationObject.numericCodes = {
    'valid': VerificationObject.valid,
    'invalid': VerificationObject.invalid,
    'disposable': VerificationObject.disposable,
    'catchall': VerificationObject.catchall,
    'unknown': VerificationObject.unknown,
};

module.exports = VerificationObject;