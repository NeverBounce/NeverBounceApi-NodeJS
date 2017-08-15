'use strict';

const HttpsClient = require('./HttpsClient'),
    VerificationObject = require('./VerificationObject');

class Single extends HttpsClient {

    /**
     * Performs the verification
     * @param email
     * @param address_info
     * @param credits_info
     * @param timeout
     * @returns {Promise}
     */
    check(email, address_info, credits_info, timeout) {
        return this.request({
            method: 'GET',
            path: '/v4/single/check'
        }, {
            email: email,
            address_info: address_info || null,
            credits_info: credits_info || null,
            timeout: timeout || null
        }).then(
            (resp) => Promise.resolve(new VerificationObject(resp)),
            (e) => Promise.reject(e)
        )
    }
}

module.exports = Single;