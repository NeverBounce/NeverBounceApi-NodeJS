const assert = require('chai').assert,
    NeverBounce = require('../src/NeverBounce');

describe('NeverBounce SDK', function () {
    describe('constructor', function () {
        it('should return default config when no params are given', function () {
            const nb0 = new NeverBounce();
            assert.deepEqual(nb0.getConfig(), NeverBounce.defaultConfig);
        });

        it('should accept arguments in constructor to override defaults', function () {
            const nb0 = new NeverBounce({
                apiKey: 'xxx',
                apiVersion: 'v4',
                timeout: 100,
                opts: {
                    host: 'test.neverbounce.com'
                }
            });

            assert.notDeepEqual(nb0.getConfig(), NeverBounce.defaultConfig);
            assert.equal(nb0.getConfig().apiKey, 'xxx');
            assert.equal(nb0.getConfig().apiVersion, 'v4');
            assert.deepEqual(nb0.getConfig().opts, {
                acceptedType: 'application/json',
                host: 'test.neverbounce.com',
                port: 443,
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

        it('should be able to set API version after initialization', function () {
            nb0.setApiVersion('v4');
            assert.equal(nb0.getConfig().apiVersion, 'v4');
        });
    });

    describe('Request Options', function () {
        it('should be overridable on a per request basis', function () {
            const nb0 = new NeverBounce();
            assert.deepEqual(nb0.getConfig().opts, {
                acceptedType: 'application/json',
                host: 'api.neverbounce.com',
                port: 443,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
                }
            });

            assert.deepEqual(nb0.getRequestOpts({'path': '/health'}), {
                acceptedType: 'application/json',
                path: '/health',
                host: 'api.neverbounce.com',
                port: 443,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
                }
            });
        });
    });

    /**
     * @since 4.1.4
     */
    describe('Helpers/Constants', function() {
        describe('VerificationObject Helpers', function() {
            it('exposes text result code definitions', function() {
                assert.equal(NeverBounce.result.valid, 0);
                assert.equal(NeverBounce.result.invalid, 1);
                assert.equal(NeverBounce.result.disposable, 2);
                assert.equal(NeverBounce.result.catchall, 3);
                assert.equal(NeverBounce.result.unknown, 4);
            });

            it('exposes numeric result code definitions', function() {
                assert.equal(NeverBounce.result[0], 'valid');
                assert.equal(NeverBounce.result[1], 'invalid');
                assert.equal(NeverBounce.result[2], 'disposable');
                assert.equal(NeverBounce.result[3], 'catchall');
                assert.equal(NeverBounce.result[4], 'unknown');
            });

            it('exposes verification result flag definitions', function() {
                assert.equal(NeverBounce.result.flags.academic_host, 'acedemic_host'); // API returns misspelling, kept for backwards compat
                assert.containsAllKeys(NeverBounce.result.flags, [
                    'has_dns',
                    'has_dns_mx',
                    'bad_syntax',
                    'free_email_host',
                    'profanity',
                    'role_account',
                    'disposable_email',
                    'government_host',
                    'academic_host',
                    'military_host',
                    'international_host',
                    'squatter_host',
                    'spelling_mistake',
                    'bad_dns',
                    'temporary_dns_error',
                    'connect_fails',
                    'accepts_all',
                    'contains_alias',
                    'contains_subdomain',
                    'smtp_connectable',
                    'spamtrap_network',
                ]);
            });
        });

        describe('Jobs Helpers', function() {
            it('exposes input type helpers', function() {
                assert.equal(NeverBounce.job.inputType.remote, 'remote_url');
                assert.equal(NeverBounce.job.inputType.supplied, 'supplied');
            });

            it('exposes job status helpers', function() {
                assert.containsAllKeys(NeverBounce.job.status, [
                    'under_review',
                    'queued',
                    'failed',
                    'complete',
                    'running',
                    'parsing',
                    'waiting',
                    'waiting_analyzed',
                    'uploading'
                ]);
            });
        });

        describe('Errors Object', function() {
            it('exposes error static types', function() {
                assert.hasAllKeys(NeverBounce.errors, [
                    'AuthError',
                    'BadReferrerError',
                    'GeneralError',
                    'ThrottleError',
                    '_lut'
                ]);
            });
        });
    });
});
