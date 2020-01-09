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
            const config = this._nb.getConfig()
            // Set key
            data.key = config.apiKey;

            // Encode params
            const query = JSON.stringify(data);

            // Get request options
            const opts = this._nb.getRequestOpts(params);
            if(opts.path) {
                opts.path = `/${config.apiVersion}/${opts.path}`;
            }
            opts.headers['User-Agent'] = 'NeverBounceApi-NodeJS/' + _Version;
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

                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });

                res.on('end', () => {
                    return this.parseResponse(opts, rawData, res.headers, res.statusCode)
                        .then(resp => resolve(resp), err => reject(err));
                })
            });

            req.on('error', (e) => reject(e));

            // Do request
            req.write(query);
            req.end();

            // Handle timeout
            if (config.timeout) {
                req.setTimeout(config.timeout, () => {
                    req.destroy();
                });
            }
        })
    }

    parseResponse(opts, chunks, headers, code) {
        return new Promise((resolve, reject) => {

            if (headers['content-type'] !== opts.acceptedType) {
                return reject(
                    new _Error(
                        _Error.GeneralError,
                        'The response from NeverBounce was returned with the '
                        + `type "${headers['content-type']}" but a response `
                        + `type of "${opts.acceptedType}" was expected. Try the`
                        + ' request again, if this error persists'
                        + ' let us know at support@neverbounce.com.'
                        + '\n\n(Internal error)'
                    )
                );
            }

            if (headers['content-type'] === 'application/json') {
                let decoded;

                try {
                    decoded = JSON.parse(chunks);
                } catch (err) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
                            'The response from NeverBounce was unable '
                            + 'to be parsed as json. Try the request '
                            + 'again, if this error persists'
                            + ' let us know at support@neverbounce.com.'
                            + '\n\n(Internal error)'
                        )
                    );
                }

                // Check if response was able to be decoded
                // (some versions of node don't throw an error when JSON.parse fails)
                if (!decoded) {
                    return reject(
                        new _Error(
                            _Error.GeneralError,
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
                            _Error.GeneralError,
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
                    let errorType = _Error._lut[decoded.status] || _Error.GeneralError;
                    if(errorType === _Error.AuthError) {
                        return reject(
                            new _Error(
                                _Error.AuthError,
                                'We were unable to authenticate your request. '
                                + 'The following information was supplied: '
                                + `${decoded.message}`
                                + '\n\n(auth_failure)'
                            )
                        );
                    } else {
                        return reject(
                            new _Error(
                                errorType,
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
