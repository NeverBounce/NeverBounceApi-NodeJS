const chai = require('chai'),
    chaiAsPromised = require("chai-as-promised"),
    nock = require('nock'),
    _Errors = require('../src/Errors'),
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
                "status": "success",
                "total_results": 1,
                "total_pages": 1,
                "query": {
                    "page": 1,
                    "items_per_page": 10,
                },
                "results": [
                    {
                        "id": 277461,
                        "status": "complete",
                        "filename": "Created from Array.csv",
                        "created_at": "2017-07-25 16:25:19",
                        "started_at": "2017-07-25 16:25:30",
                        "finished_at": "2017-07-25 16:25:31",
                        "total": {
                            "records": 2,
                            "billable": 2,
                            "processed": 2,
                            "valid": 0,
                            "invalid": 2,
                            "catchall": 0,
                            "disposable": 0,
                            "unknown": 0,
                            "duplicates": 0,
                            "bad_syntax": 0
                        },
                        "bounce_estimate": 0,
                        "percent_complete": 100
                    }
                ],
                "execution_time": 388
            });

            return nb.jobs.search({}).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('results'));
        });

        it('should reject the promise and provide an error', function () {
            scope.get('/v4/jobs/search').reply(200, {
                "status": "general_failure",
                "message": "An error occurred",
                "execution_time": 499
            });

            return nb.jobs.search({}).should.be.rejected
                .then(err => err.should.contain({'type': _Errors.GeneralError}));
        });
    });

    describe('create', function () {
        it('should return the response', function () {
            scope.get('/v4/jobs/search').reply(200, {
                "status": "success",
                "total_results": 1,
                "total_pages": 1,
                "query": {
                    "page": 1,
                    "items_per_page": 10,
                },
                "results": [
                    {
                        "id": 277461,
                        "status": "complete",
                        "filename": "Created from Array.csv",
                        "created_at": "2017-07-25 16:25:19",
                        "started_at": "2017-07-25 16:25:30",
                        "finished_at": "2017-07-25 16:25:31",
                        "total": {
                            "records": 2,
                            "billable": 2,
                            "processed": 2,
                            "valid": 0,
                            "invalid": 2,
                            "catchall": 0,
                            "disposable": 0,
                            "unknown": 0,
                            "duplicates": 0,
                            "bad_syntax": 0
                        },
                        "bounce_estimate": 0,
                        "percent_complete": 100
                    }
                ],
                "execution_time": 388
            });

            return nb.jobs.search({}).should.be.fulfilled
                .then(resp => resp.should.be.an('object').that.contains.key('results'));
        });

        it('should reject the promise and provide an error', function () {
            scope.get('/v4/jobs/search').reply(200, {
                "status": "general_failure",
                "message": "An error occurred",
                "execution_time": 499
            });

            return nb.jobs.search({}).should.be.rejected
                .then(err => err.should.contain({'type': _Errors.GeneralError}));
        });
    });
});