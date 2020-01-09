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
     * @param historicalData
     * @returns {Promise}
     */
    check(email, address_info, credits_info, timeout, historicalData) {
        const data = {
            email: email,
            address_info: address_info || null,
            credits_info: credits_info || null,
            timeout: timeout || null
        };

        if(historicalData !== undefined) {
            data.request_meta_data = { leverage_historical_data: historicalData ? 1 : 0 };
        }

        return this.request({
            method: 'GET',
            path: 'single/check'
        }, data).then(
            (resp) => Promise.resolve(new VerificationObject(resp)),
            (e) => Promise.reject(e)
        )
    }
}

module.exports = Single;
