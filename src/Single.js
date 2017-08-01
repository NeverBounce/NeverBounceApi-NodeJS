const HttpsClient = require('./HttpsClient'),
    VerificationObject = require('./VerificationObject');

class Single extends HttpsClient {

    /**
     * Performs the verification
     * @param email
     * @param address_info
     * @param credits_info
     * @returns {Promise}
     */
    verify(email, address_info = null, credits_info = null) {
        return this.request({path: '/v4/single/check'}, {
            email: email,
            address_info: address_info,
            credits_info: credits_info
        }).then(
            (resp) => Promise.resolve(new VerificationObject(resp)),
            (e) => Promise.reject(e)
        )
    }
}

module.exports = Single;