// Just a dummy test for now...
var assert = require('assert');
var Single = require('../lib/single');

describe('Single', function() {
    describe('Constructor', function () {
        it('should return the correct result from the response', function () {
            var result = new Single.Result({
                success: true,
                result: 0,
                result_details: 0,
                execution_time: 0.22115206718445
            });
            assert.equal(result.getResult(), 0);
            assert.equal(result.getResultTextCode(), 'valid');
        });
    });
    describe('is', function () {
        it('should return the true when in range, false when out', function () {
            var result = new Single.Result({
                success: true,
                result: 0,
                result_details: 0,
                execution_time: 0.22115206718445
            });
            assert.equal(result.is(0), true);
            assert.equal(result.is(Single.Result.valid), true);
            assert.equal(result.is(1), false);
            assert.equal(result.is([0,3,4]), true);
            assert.equal(result.is([1,2]), false);
        });
    });
    describe('not', function () {
        it('should return the true when NOT in range, false when in', function () {
            var result = new Single.Result({
                success: true,
                result: 0,
                result_details: 0,
                execution_time: 0.22115206718445
            });
            assert.equal(result.not(0), false);
            assert.equal(result.not(Single.Result.valid), false);
            assert.equal(result.not(1), true);
            assert.equal(result.not([0,3,4]), false);
            assert.equal(result.not([1,2]), true);
        });
    });
});