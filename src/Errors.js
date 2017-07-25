_Error.AuthError = 'AuthError';
_Error.BadReferrerError = 'BadReferrerError';
_Error.GeneralError = 'GeneralError';
_Error.HttpClientError = 'HttpClientError';
_Error.ThrottleError = 'ThrottleError';

function _Error(type, message) {
    this.name = 'NeverBounce Error';
    this.type = type || 'GenericError';
    this.message = message || 'Generic Error';
    this.stack = (new Error()).stack;
}
_Error.prototype = Object.create(Error.prototype);
_Error.prototype.constructor = _Error;

module.exports = _Error;