'use strict';

const https = require('https');
const _Error = require('./Errors');
const _Version = require('../package.json').version;

class HttpsClient {

    constructor(_nb) {
        this._nb = _nb;
    }

    /**
     * Performs actual requests
     * @param params
     * @param data
     * @returns {Promise}
     * @private
     */
    request(params, data) {
        data = data || {};
        return new Promise((resolve, reject) => {
            // Set key
            data.key = this._nb.getConfig().apiKey;

            // Encode params
            const query = JSON.stringify(data);

            // Get request options
            const opts = this._nb.getRequestOpts(params);
            opts.headers['User-Agent'] = "NeverBounceApi-NodeJS/" + _Version;
            opts.headers['Content-Length'] = Buffer.byteLength(query);

            // Make request
            const req = https.request(opts, (res) => {

                // Handle 4xx HTTP codes
                if (res.statusCode >= 400 && res.statusCode < 500) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'We were unable to complete your request. '
                            + 'The following information was supplied: '
                            + `\n\n(Request error [status ${res.statusCode}])`
                        )
                    );
                }

                // Handle 5xx HTTP codes
                if (res.statusCode >= 500) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'We were unable to complete your request. '
                            + 'The following information was supplied: '
                            + `\n\n(Internal error [status ${res.statusCode}])`
                        )
                    );
                }

                res.setEncoding('utf8');
                res.on('data', (chunks) => {
                    return this.parseResponse(chunks, res.headers, res.statusCode)
                        .then(resp => resolve(resp), err => reject(err));
                });
            });

            req.on('error', (e) => reject(e));

            // Do request
            req.write(query);
            req.end();

            // Handle timeout
            if (this._nb.getConfig().timeout) {
                req.setTimeout(this._nb.getConfig().timeout, () => {
                    req.destroy();
                });
            }
        })
    }

    parseResponse(chunks, headers, code) {
        return new Promise((resolve, reject) => {
            if (headers['content-type'] === 'application/json') {
                let decoded;

                try {
                    decoded = JSON.parse(chunks);
                } catch (err) {
                    return reject(
                        new _Error(
                            _Error.HttpClientError,
                            'The response from NeverBounce was unable '
                            + 'to be parsed as json. Try the request '
                            + 'again, if this error persists'
                            + ' let us know at support@neverbounce.com.'
                            + '\n\n(Internal error)'
                        )
                    );
                }

                // Check if response was able to be decoded
                if (!decoded) {
                    return reject(
                        new _Error(
                            _Error.HttpClientError,
                            'The response from NeverBounce was unable '
                            + 'to be parsed as json. Try the request '
                            + 'again, if this error persists'
                            + ' let us know at support@neverbounce.com.'
                            + '\n\n(Internal error)'
                        )
                    );
                }

                // Check for missing status and error messages
                if (decoded.status === undefined || (decoded.status !== 'success' && decoded.message === undefined)) {
                    return reject(
                        new _Error(
                            _Error.HttpClientError,
                            'The response from server is incomplete. '
                            + 'Either a status code was not included or '
                            + 'the an error was returned without an error '
                            + 'message. Try the request again, if '
                            + 'this error persists let us know at'
                            + ' support@neverbounce.com.'
                            + `\n\n(Internal error [status ${code}: ${decoded}])`
                        )
                    );
                }

                // Handle other success statuses
                if (decoded.status !== 'success') {
                    switch (decoded.status) {
                        case 'auth_failure':
                            return reject(
                                new _Error(
                                    _Error.AuthError,
                                    'We were unable to authenticate your request. '
                                    + 'The following information was supplied: '
                                    + `${decoded.message}`
                                    + '\n\n(auth_failure)'
                                )
                            );

                        case 'temp_unavail':
                            return reject(
                                new _Error(
                                    _Error.GeneralError,
                                    'We were unable to complete your request. '
                                    + 'The following information was supplied: '
                                    + `${decoded.message}`
                                    + '\n\n(temp_unavail)'
                                )
                            );

                        case 'throttle_triggered':
                            return reject(
                                new _Error(
                                    _Error.ThrottleError,
                                    'We were unable to complete your request. '
                                    + 'The following information was supplied: '
                                    + `${decoded.message}`
                                    + '\n\n(throttle_triggered)'
                                )
                            );

                        case 'bad_referrer':
                            return reject(
                                new _Error(
                                    _Error.BadReferrerError,
                                    'We were unable to complete your request. '
                                    + 'The following information was supplied: '
                                    + `${decoded.message}`
                                    + '\n\n(bad_referrer)'
                                )
                            );

                        case 'general_failure':
                        default:
                            return reject(
                                new _Error(
                                    _Error.GeneralError,
                                    'We were unable to complete your request. '
                                    + 'The following information was supplied: '
                                    + `${decoded.message}`
                                    + `\n\n(${decoded.status})`
                                )
                            );
                    }
                }

                return resolve(decoded);
            }

            return resolve(chunks);
        });
    }
}

module.exports = HttpsClient;