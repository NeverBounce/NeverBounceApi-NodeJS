const chai = require("chai"),
    chaiAsPromised = require("chai-as-promised"),
    nock = require('nock'),
    _Errors = require('../lib/Errors'),
    NeverBounce = require('../lib/NeverBounce'),
    HttpsClient = require('../lib/HttpsClient');

chai.use(chaiAsPromised);
chai.should();

// Setup node request mock
const scope = nock('https://api.neverbounce.com')
    .get('/v4/test');

// Create NeverBounce object
const nb = new NeverBounce();

describe('HttpsClient', function() {
    const http = new HttpsClient(nb);
    it('decodes JSON repsonses', function () {
        scope.reply(200, {'status': 'success'}, {
                'Content-Type': 'application/json'
            });

        return http.request({path: '/v4/test'}).should.be.fulfilled
            .then(
                resp => resp.should.be.an('object').that.have.property('status')
            )
    });

    it('leaves non JSON responses as is', function () {
        scope.reply(200, 'Hello World!', {
            'Content-Type': 'text/plain'
        });

        return http.request({path: '/v4/test'}).should.be.fulfilled
            .then(
                resp => resp.should.be.a('string').that.is.equal('Hello World!')
            )
    });

    it('rejects 4xx HTTP status codes', function () {
        scope.reply(404, 'Not Found', {
            'Content-Type': 'text/plain'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.GeneralError})
            )
    });

    it('rejects 5xx HTTP status codes', function () {
        scope.reply(500, 'Internal Service Error', {
            'Content-Type': 'text/plain'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.GeneralError})
            )
    });

    it('rejects poorly formatted JSON', function () {
        scope.reply(200, "{'bad_json'}", {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.HttpClientError})
            )
    });

    it('rejects partial json responses', function () {
        scope.reply(200, {'status': 'general_error'}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.HttpClientError})
            )
    });

    it('rejects auth_failure statuses', function () {
        scope.reply(200, {'status': 'auth_failure', 'message': "Missing required parameter 'key'"}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.AuthError})
            )
    });

    it('rejects temp_unavail statuses', function () {
        scope.reply(200, {'status': 'temp_unavail', 'message': "Service has gone away"}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.GeneralError})
            )
    });

    it('rejects throttle_triggered statuses', function () {
        scope.reply(200, {'status': 'throttle_triggered', 'message': "Too many requrests"}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.ThrottleError})
            )
    });

    it('rejects bad_referrer statuses', function () {
        scope.reply(200, {'status': 'bad_referrer', 'message': "The requests referrer is not trusted"}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.BadReferrerError})
            )
    });

    it('rejects general_failure statuses', function () {
        scope.reply(200, {'status': 'general_failure', 'message': "Something has gone wrong"}, {
            'Content-Type': 'application/json'
        });

        return http.request({path: '/v4/test'}).should.be.rejected
            .then(
                err => err.should.contain({'type': _Errors.GeneralError})
            )
    });
});