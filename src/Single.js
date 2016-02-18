var HttpsClient = require('./HttpsClient');

module.exports = HttpsClient.extend({

    verify(email) {
        return this.request({path: '/v3/single'}, {email: email})
    }

});