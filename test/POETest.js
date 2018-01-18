const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    nock = require('nock'),
    NeverBounce = require('../src/NeverBounce');

chai.use(chaiAsPromised);
chai.should();

// Setup node request mock
const scope = nock('https://api.neverbounce.com')
    .post('/v4/poe/confirm');

// Create NeverBounce object
const nb = new NeverBounce();

describe('POE', function () {
    describe('confirm', function () {
        it('should return a object during a good response', function () {
            scope.reply(200, {
                'status': 'success',
                'confirmed': true,
                'execution_time': 499
            });

            return nb.poe.confirm('support@neverbounce.com', 'valid', 'e3173fdbbdce6bad26522dae792911f2', 'NBPOE-TXN-5942940c09669').should.be.fulfilled
                .then(resp => resp.should.be.a('Object'));
        });
    });
});