'use strict';

var HttpsClient = require('./HttpsClient');

function Result(result) {
    this.response = result;
}

Result.valid = 0;
Result.invalid = 1;
Result.disposable = 2;
Result.catchall = 3;
Result.unknown = 4;

Result.textCodes = {
    0: 'valid',
    1: 'invalid',
    2: 'disposable',
    3: 'catchall',
    4: 'unknown'
};

Result.prototype = {

    /**
     * Returns result
     * @returns {Object}
     */

    getResult: function getResult() {
        return this.response.result;
    },


    /**
     * Returns text code
     * @returns {*}
     */
    getResultTextCode: function getResultTextCode() {
        return Result.textCodes[this.getResult()];
    },


    /**
     * Returns true if result is of specified types
     * @param codes
     * @returns {boolean}
     */
    is: function is(codes) {
        // Single type
        if (typeof codes === 'number') {
            return this.getResult() === codes ? true : false;
        }
        // Handle array
        else {
                return codes.indexOf(this.getResult()) > -1 ? true : false;
            }
    },


    /**
     * Returns true if result is NOT of specified types
     * @param codes
     * @returns {boolean}
     */
    not: function not(codes) {
        // Single type
        if (typeof codes === 'number') {
            return this.getResult() === codes ? false : true;
        }
        // Handle array
        else {
                return codes.indexOf(this.getResult()) > -1 ? false : true;
            }
    }
};

module.exports = {
    client: HttpsClient.extend({

        /**
         * Do the verification!
         * @param email
         * @returns {Promise.<T>}
         */

        verify: function verify(email) {
            return this.request({ path: '/v3/single' }, { email: email }).then(function (res) {
                return Promise.resolve(new Result(res));
            });
        }
    }),
    Result: Result
};