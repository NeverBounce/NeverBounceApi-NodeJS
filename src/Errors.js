'use strict';

_Error.AuthError = 'AuthError';
_Error.BadReferrerError = 'BadReferrerError';
_Error.GeneralError = 'GeneralError'; // Fallback error
_Error.ThrottleError = 'ThrottleError';

_Error._lut = {
    'general_failure': _Error.GeneralError, // Fallback error
    'auth_failure': _Error.AuthError,
    'bad_referrer': _Error.BadReferrerError,
    'throttle_triggered': _Error.ThrottleError,
};

function _Error(type, message) {
    this.name = 'NeverBounce Error';
    this.type = type || 'GeneralError';
    this.message = message || 'General Error';
    this.stack = (new Error()).stack;
}
_Error.prototype = Object.create(Error.prototype);
_Error.prototype.constructor = _Error;

module.exports = _Error;