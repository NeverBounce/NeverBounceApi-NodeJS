'use strict';

const HttpsClient = require('./HttpsClient');

class Account extends HttpsClient {

    /**
     * Returns account info
     * @param email
     * @returns {Promise.<T>}
     */
    info() {
        return this.request({
            method: 'GET',
            path: 'account/info'
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }
}

module.exports = Account;
