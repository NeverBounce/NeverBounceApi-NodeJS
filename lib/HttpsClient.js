'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var https = require('https');
var _Error = require('./Errors');

var HttpsClient = function () {
    function HttpsClient(_nb) {
        _classCallCheck(this, HttpsClient);

        this._nb = _nb;
    }

    /**
     * Performs actual requests
     * @param params
     * @param data
     * @returns {Promise}
     * @private
     */


    _createClass(HttpsClient, [{
        key: 'request',
        value: function request(params) {
            var _this = this;

            var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            return new Promise(function (resolve, reject) {
                // Set key
                data.key = _this._nb.getConfig().apiKey;

                // Encode params
                var query = JSON.stringify(data);

                // Get request options
                var opts = _this._nb.getRequestOpts(params);
                opts.headers['Content-Length'] = Buffer.byteLength(query);

                // Make request
                var req = https.request(opts, function (res) {

                    // Handle 4xx HTTP codes
                    if (res.statusCode >= 400 && res.statusCode < 500) {
                        return reject(new _Error(_Error.GeneralError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('\n\n(Request error [status ' + res.statusCode + '])')));
                    }

                    // Handle 5xx HTTP codes
                    if (res.statusCode >= 500) {
                        return reject(new _Error(_Error.GeneralError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('\n\n(Internal error [status ' + res.statusCode + '])')));
                    }

                    res.setEncoding('utf8');
                    res.on('data', function (chunks) {
                        return _this.parseResponse(chunks, res.headers, res.statusCode).then(function (resp) {
                            return resolve(resp);
                        }, function (err) {
                            return reject(err);
                        });
                    });
                });

                req.on('error', function (e) {
                    return reject(e);
                });

                // Do request
                req.write(query);
                req.end();

                // Handle timeout
                if (_this._nb.getConfig().timeout) {
                    req.setTimeout(_this._nb.getConfig().timeout, function () {
                        req.destroy();
                    });
                }
            });
        }
    }, {
        key: 'parseResponse',
        value: function parseResponse(chunks, headers, code) {
            return new Promise(function (resolve, reject) {
                if (headers['content-type'] === 'application/json') {
                    var decoded = void 0;

                    try {
                        decoded = JSON.parse(chunks);
                    } catch (err) {
                        return reject(new _Error(_Error.HttpClientError, 'The response from NeverBounce was unable ' + 'to be parsed as json. Try the request ' + 'again, if this error persists' + ' let us know at support@neverbounce.com.' + '\n\n(Internal error)'));
                    }

                    // Check if response was able to be decoded
                    if (!decoded) {
                        return reject(new _Error(_Error.HttpClientError, 'The response from NeverBounce was unable ' + 'to be parsed as json. Try the request ' + 'again, if this error persists' + ' let us know at support@neverbounce.com.' + '\n\n(Internal error)'));
                    }

                    // Check for missing status and error messages
                    if (decoded.status === undefined || decoded.status !== 'success' && decoded.message === undefined) {
                        return reject(new _Error(_Error.HttpClientError, 'The response from server is incomplete. ' + 'Either a status code was not included or ' + 'the an error was returned without an error ' + 'message. Try the request again, if ' + 'this error persists let us know at' + ' support@neverbounce.com.' + ('\n\n(Internal error [status ' + code + ': ' + decoded + '])')));
                    }

                    // Handle other success statuses
                    if (decoded.status !== 'success') {
                        switch (decoded.status) {
                            case 'auth_failure':
                                return reject(new _Error(_Error.AuthError, 'We were unable to authenticate your request. ' + 'The following information was supplied: ' + ('' + decoded.message) + '\n\n(auth_failure)'));

                            case 'temp_unavail':
                                return reject(new _Error(_Error.GeneralError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('' + decoded.message) + '\n\n(temp_unavail)'));

                            case 'throttle_triggered':
                                return reject(new _Error(_Error.ThrottleError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('' + decoded.message) + '\n\n(throttle_triggered)'));

                            case 'bad_referrer':
                                return reject(new _Error(_Error.BadReferrerError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('' + decoded.message) + '\n\n(bad_referrer)'));

                            case 'general_failure':
                            default:
                                return reject(new _Error(_Error.GeneralError, 'We were unable to complete your request. ' + 'The following information was supplied: ' + ('' + decoded.message) + '\n\n({$decoded[\'status\']})'));
                        }
                    }

                    return resolve(decoded);
                }

                return resolve(chunks);
            });
        }
    }]);

    return HttpsClient;
}();

module.exports = HttpsClient;