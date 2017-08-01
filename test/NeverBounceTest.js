const assert = require('assert'),
    NeverBounce = require('../lib/NeverBounce');

describe('NeverBounce SDK', function () {
    describe('constructor', function () {
        it('should return default config when no params are given', function () {
            const nb0 = new NeverBounce();
            assert.deepEqual(nb0.getConfig(), NeverBounce.defaultConfig);
        });

        it('should accept arguments in constructor to override defaults', function () {
            const nb0 = new NeverBounce({
                apiKey: 'xxx',
                timeout: 100,
                opts: {
                    host: 'test.neverbounce.com'
                }
            });

            assert.notDeepEqual(nb0.getConfig(), NeverBounce.defaultConfig);
            assert.equal(nb0.getConfig().apiKey, 'xxx');
            assert.deepEqual(nb0.getConfig().opts, {
                host: 'test.neverbounce.com',
                port: 443,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
                }
            });
        });

        it('should load API resources', function () {
            const nb0 = new NeverBounce();
            assert.notEqual(nb0.single, undefined);
        });
    });

    describe('Setters', function () {
        const nb0 = new NeverBounce();
        it('should be able to set API key after initialization', function () {
            nb0.setApiKey('xxx');
            assert.equal(nb0.getConfig().apiKey, 'xxx');
        });

        it('should be able to set API host after initialization', function () {
            nb0.setHost('https://router.neverbounce.com');
            assert.equal(nb0.getConfig().opts.host, 'https://router.neverbounce.com');
        });
    });

    describe('Request Options', function () {
        it('should be overridable on a per request basis', function () {
            const nb0 = new NeverBounce();
            assert.deepEqual(nb0.getConfig().opts, {
                host: 'api.neverbounce.com',
                port: 443,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
                }
            });

            assert.deepEqual(nb0.getRequestOpts({'path': '/health'}), {
                path: '/health',
                host: 'api.neverbounce.com',
                port: 443,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
                }
            });
        });
    });
});