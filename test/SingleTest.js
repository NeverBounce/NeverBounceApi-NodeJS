const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('nock'),
    VerificationObject = require('../src/VerificationObject'),
    NeverBounce = require('../src/NeverBounce');

chai.use(chaiAsPromised);
chai.should();

// Setup node request mock
const scope = nock('https://api.neverbounce.com')
    .get('/v4/single/check');

// Create NeverBounce object
const nb = new NeverBounce();

describe('Single', function () {
    describe('check', function () {
        it('should return an instance of VerificationObject with a good response', function () {
            scope.reply(200, {
                'status': 'success',
                'result': 'valid',
                'flags': [
                    'has_dns',
                    'has_dns_mx'
                ],
                'suggested_correction': '',
                'retry_token': '',
                'execution_time': 499
            });

            return nb.single.check('support@neverbounce.com').should.be.fulfilled
                .then(resp => resp.should.be.an.instanceOf(VerificationObject));
        });
    });
});