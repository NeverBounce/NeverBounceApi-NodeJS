'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var VerificationObject = function () {
    function VerificationObject(response) {
        _classCallCheck(this, VerificationObject);

        this.response = response;
    }

    /**
     * Returns result
     * @returns {Object}
     */


    _createClass(VerificationObject, [{
        key: 'getResult',
        value: function getResult() {
            return this.response.result;
        }

        /**
         * Returns text code
         * @returns {*}
         */

    }, {
        key: 'getNumericResult',
        value: function getNumericResult() {
            return VerificationObject.numericCodes[this.getResult()];
        }

        /**
         * Returns true if result is of specified types
         * @param codes
         * @returns {boolean}
         */

    }, {
        key: 'is',
        value: function is(codes) {
            if (Array.isArray(codes)) {
                return codes.indexOf(this.getResult()) > -1 || codes.indexOf(this.getNumericResult()) > -1;
            } else {
                return codes === this.getResult() || codes === this.getNumericResult();
            }
        }

        /**
         * Returns true if result is NOT of specified types
         * @param codes
         * @returns {boolean}
         */

    }, {
        key: 'not',
        value: function not(codes) {
            if (Array.isArray(codes)) {
                return codes.indexOf(this.getResult()) === -1 && codes.indexOf(this.getNumericResult()) === -1;
            } else {
                return codes !== this.getResult() && codes !== this.getNumericResult();
            }
        }

        /**
         * Returns true if the flag was returned
         * @param flag
         * @returns {boolean}
         */

    }, {
        key: 'hasFlag',
        value: function hasFlag(flag) {
            return this.response && this.response.flags && this.response.flags.indexOf(flag) > -1;
        }
    }]);

    return VerificationObject;
}();

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
    'unknown': VerificationObject.unknown
};

module.exports = VerificationObject;