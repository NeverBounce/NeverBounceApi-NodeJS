// Just a dummy test for now...
var assert = require('assert');
describe('NeverBounce', function() {
    describe('Constructor', function () {
        it('should return default config when no params are given', function () {
            var nb0 = require('../lib/NeverBounce')();
            assert.deepEqual(nb0.getConfig(), nb0.getDefaultConfig());
        });

        it('should return default new config when no params are given', function () {
            var nb1 = require('../lib/NeverBounce')({
                apiKey: 'xxx',
                apiSecret: 'yyy'
            });
            assert.notDeepEqual(nb1.getConfig(), nb1.getDefaultConfig());
            assert.equal(nb1.getConfig().apiKey, 'xxx');
            assert.equal(nb1.getConfig().apiSecret, 'yyy');
            assert.deepEqual(nb1.getConfig().opts, nb1.getDefaultConfig().opts);
        });
    });

    describe('Setters', function() {
        var nb0 = require('../lib/NeverBounce')();
        it('should be able to set API key after initialization', function () {
            nb0.setApiKey('xxx');
            assert.equal(nb0.getConfig().apiKey, 'xxx');
        });

        it('should be able to set API secret after initialization', function () {
            nb0.setApiSecret('yyy');
            assert.equal(nb0.getConfig().apiSecret, 'yyy');
        });

        it('should be able to set API router after initialization', function () {
            nb0.setHost('https://router.neverbounce.com');
            assert.equal(nb0.getConfig().opts.host, 'https://router.neverbounce.com');
        });

        it('should be able to set API version after initialization', function () {
            nb0.setVersion('v4');
            assert.equal(nb0.getConfig().opts.prefix, '/v4/');
        });
    });

    describe('Request Options', function() {

        it('request opts should always be able to be overridable on a per request basis', function () {
            var nb2 = require('../lib/NeverBounce')();
            assert.deepEqual(nb2.getConfig().opts, nb2.getDefaultConfig().opts);
            assert.deepEqual(nb2.getRequestOpts(), nb2.getDefaultConfig().opts);
            assert.notDeepEqual(nb2.getRequestOpts({'path': '/health'}), nb2.getRequestOpts());
            assert.equal(nb2.getRequestOpts({'path': '/health'}).path, '/health');
        });

    });
});