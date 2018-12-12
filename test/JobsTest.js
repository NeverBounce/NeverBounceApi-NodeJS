const chai = require('chai'),
    assert = chai.assert,
    chaiAsPromised = require('chai-as-promised'),
    nock = require('nock'),
    NeverBounce = require('../src/NeverBounce');

chai.use(chaiAsPromised);
chai.should();

// Setup node request mock
const scope = nock('https://api.neverbounce.com')

// Create NeverBounce object
const nb = new NeverBounce();

describe('Jobs', function () {
    describe('search', function () {
        it('should return the response', function () {
            scope.get('/v4/jobs/search').reply(200, {
                'status': 'success',
                'total_results': 1,
                'total_pages': 1,
                'query': {
                    'page': 1,
                    'items_per_page': 10,
                },
                'results': [
                    {
                        'id': 277461,
                        'status': 'complete',
                        'filename': 'Created from Array.csv',
                        'created_at': '2017-07-25 16:25:19',
                        'started_at': '2017-07-25 16:25:30',
                        'finished_at': '2017-07-25 16:25:31',
                        'total': {
                            'records': 2,
                            'billable': 2,
                            'processed': 2,
                            'valid': 0,
                            'invalid': 2,
                            'catchall': 0,
                            'disposable': 0,
                            'unknown': 0,
                            'duplicates': 0,
                            'bad_syntax': 0
                        },
                        'bounce_estimate': 0,
                        'percent_complete': 100
                    }
                ],
                'execution_time': 388
            });

            return nb.jobs.search({}).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('results'));
        });
    });

    describe('create', function () {
        it('should return the response', function () {
            scope.post('/v4/jobs/create').reply(200, {
                'status': 'success',
                'job_id': 150970,
                'execution_time': 388
            });

            return nb.jobs.create('https://example.com/file.csv', 'remote_url', 'Created From Remote File.csv').should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('job_id'));
        });
    });

    describe('parse', function () {
        it('should return the response', function () {
            scope.post('/v4/jobs/parse').reply(200, {
                'status': 'success',
                'queue_id': 'NB-PQ-59246392E9E5D',
                'execution_time': 388
            });

            return nb.jobs.parse(150970).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('queue_id'));
        });
    });

    describe('start', function () {
        it('should return the response', function () {
            scope.post('/v4/jobs/start').reply(200, {
                'status': 'success',
                'queue_id': 'NB-PQ-59246392E9E5D',
                'execution_time': 388
            });

            return nb.jobs.start(150970).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('queue_id'));
        });
    });

    describe('status', function () {
        it('should return the response', function () {
            scope.get('/v4/jobs/status').reply(200, {
                'status': 'success',
                'id': 277461,
                'filename': 'Created from Array.csv',
                'created_at': '2017-07-25 14:52:27',
                'started_at': '2017-07-25 14:52:40',
                'finished_at': '2017-07-25 14:53:06',
                'total': {
                    'records': 2,
                    'billable': 2,
                    'processed': 2,
                    'valid': 0,
                    'invalid': 2,
                    'catchall': 0,
                    'disposable': 0,
                    'unknown': 0,
                    'duplicates': 0,
                    'bad_syntax': 0
                },
                'bounce_estimate': 0,
                'percent_complete': 100,
                'job_status': 'complete',
                'execution_time': 322
            });

            return nb.jobs.status(150970).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('total'));
        });
    });

    describe('results', function () {
        it('should return the response', function () {
            scope.get('/v4/jobs/results').reply(200, {
                'status': 'success',
                'total_results': 3,
                'total_pages': 1,
                'query': {
                    'job_id': 251319,
                    'valids': 1,
                    'invalids': 1,
                    'disposables': 1,
                    'catchalls': 1,
                    'unknowns': 1,
                    'page': 0,
                    'items_per_page': 10
                },
                'results': [
                    {
                        'data': {
                            'email': 'email',
                            'id': 'id',
                            'name': 'name'
                        },
                        'verification': {
                            'result': 'invalid',
                            'flags': [],
                            'suggested_correction': '',
                            'address_info': {
                                'original_email': 'email',
                                'normalized_email': '',
                                'addr': '',
                                'alias': '',
                                'host': '',
                                'fqdn': '',
                                'domain': '',
                                'subdomain': '',
                                'tld': ''
                            }
                        }
                    },
                    {
                        'data': {
                            'email': 'support@neverbounce.com',
                            'id': '12345',
                            'name': 'Fred McValid'
                        },
                        'verification': {
                            'result': 'valid',
                            'flags': [
                                'smtp_connectable',
                                'has_dns',
                                'has_dns_mx',
                                'role_account'
                            ],
                            'suggested_correction': '',
                            'address_info': {
                                'original_email': 'support@neverbounce.com',
                                'normalized_email': 'support@neverbounce.com',
                                'addr': 'support',
                                'alias': '',
                                'host': 'neverbounce.com',
                                'fqdn': 'neverbounce.com',
                                'domain': 'neverbounce',
                                'subdomain': '',
                                'tld': 'com'
                            }
                        }
                    },
                    {
                        'data': {
                            'email': 'invalid@neverbounce.com',
                            'id': '12346',
                            'name': 'Bob McInvalid'
                        },
                        'verification': {
                            'result': 'invalid',
                            'flags': [
                                'smtp_connectable',
                                'has_dns',
                                'has_dns_mx'
                            ],
                            'suggested_correction': '',
                            'address_info': {
                                'original_email': 'invalid@neverbounce.com',
                                'normalized_email': 'invalid@neverbounce.com',
                                'addr': 'invalid',
                                'alias': '',
                                'host': 'neverbounce.com',
                                'fqdn': 'neverbounce.com',
                                'domain': 'neverbounce',
                                'subdomain': '',
                                'tld': 'com'
                            }
                        }
                    }
                ],
                'execution_time': 55
            });

            return nb.jobs.results(150970, {}).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('results'));
        });
    });

    describe('download', function () {
        it('should return the response', function () {
            scope.get('/v4/jobs/download').reply(
                200,
                'id,email,name,email_status'
                    + '"12345","support@neverbounce.com","Fred McValid",valid'
                    + '"12346","invalid@neverbounce.com","Bob McInvalid",invalid',
                {
                    'content-type': 'application/octet-stream'
                });

            return nb.jobs.download(150970, {}).should.be.fulfilled
                .then(resp => resp.should.be.a('string'));
        });
    });

    describe('delete', function () {
        it('should return the response', function () {
            scope.post('/v4/jobs/delete').reply(200, {
                'status': 'success',
                'execution_time': 388
            });

            return nb.jobs.delete(150970).should.be.fulfilled
                .then(resp => resp.should.be.an('object'));
        });
    });

    /**
     * @since 4.1.4
     */
    describe('backwards compat', function () {
        it('input types should be accessible from Jobs Object', function () {
            const jobs = require('../src/Jobs');
            assert.equal(jobs.remote, 'remote_url');
            assert.equal(jobs.supplied, 'supplied');
        });
    });
});