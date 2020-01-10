'use strict';

const HttpsClient = require('./HttpsClient');

class POE extends HttpsClient {

    /**
     * Returns account info
     * @param email
     * @param result
     * @param confirmationToken
     * @param transactionId
     * @returns {Promise.<T>}
     */
    confirm(email, result, confirmationToken, transactionId) {
        return this.request({
            method: 'POST',
            path: 'poe/confirm'
        }, {
            'email': email,
            'result': result,
            'confirmation_token': confirmationToken,
            'transaction_id': transactionId,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }
}

module.exports = POE;
