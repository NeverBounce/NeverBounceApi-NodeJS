'use strict';

const HttpsClient = require('./HttpsClient');

class Jobs extends HttpsClient {

    /**
     * Performs the verification
     * @returns {Promise}
     * @param query
     */
    search(query) {
        return this.request({
            method: 'GET',
            path: '/v4/jobs/search'
        }, query || {}).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Creates a job from a URL
     * @param input
     * @param inputlocation
     * @param filename
     * @param runsample
     * @param autoparse
     * @param autostart
     * @param historicalData
     * @returns {Promise.<*>}
     */
    create(input, inputlocation, filename, runsample, autoparse, autostart, historicalData) {
        const data = {
            'input': input,
            'input_location': inputlocation,
            'filename': filename,
            'run_sample': runsample || null,
            'auto_start': autostart || null,
            'auto_parse': autoparse || null,
        };

        if(historicalData !== undefined) {
            data.request_meta_data = { leverage_historical_data: historicalData ? 1 : 0 };
        }

        return this.request({
            method: 'POST',
            path: '/v4/jobs/create'
        }, data).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Starts parsing job after creation
     * @param jobid
     * @param autostart
     * @returns {Promise.<*>}
     */
    parse(jobid, autostart) {
        return this.request({
            method: 'POST',
            path: '/v4/jobs/parse'
        }, {
            'job_id': jobid,
            'auto_start': autostart || null,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Starts job waiting to be started
     * @param jobid
     * @param runsample
     * @param historicalData
     * @returns {Promise.<*>}
     */
    start(jobid, runsample, historicalData) {
        const data = {
            'job_id': jobid,
            'run_sample': runsample || null,
        };

        if(historicalData !== undefined) {
            data.request_meta_data = { leverage_historical_data: historicalData ? 1 : 0 };
        }

        return this.request({
            method: 'POST',
            path: '/v4/jobs/start'
        }, data).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Starts job waiting to be started
     * @param jobid
     * @returns {Promise.<*>}
     */
    status(jobid) {
        return this.request({
            method: 'GET',
            path: '/v4/jobs/status'
        }, {
            'job_id': jobid,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Retrieves job results
     * @param jobid
     * @param query
     * @returns {Promise.<*>}
     */
    results(jobid, query) {
        return this.request({
            method: 'GET',
            path: '/v4/jobs/results'
        },
        Object.assign({'job_id': jobid}, query || {})
        ).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Downloads results as CSV
     * @param jobid
     * @param query
     * @returns {Promise.<*>}
     */
    download(jobid, query) {
        return this.request({
            acceptedType: 'application/octet-stream',
            method: 'GET',
            path: '/v4/jobs/download'
        },
        Object.assign({'job_id': jobid}, query || {})
        ).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * Starts job waiting to be started
     * @param jobid
     * @returns {Promise.<*>}
     */
    delete(jobid) {
        return this.request({
            method: 'POST',
            path: '/v4/jobs/delete'
        }, {
            'job_id': jobid,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }
}

Jobs.remote = 'remote_url';
Jobs.supplied = 'supplied';

/**
 * @since 4.1.4
 */
Jobs.helpers = {
    inputType: {
        remote: Jobs.remote,
        supplied: Jobs.supplied
    },
    status: {
        under_review: 'under_review',
        queued: 'queued',
        failed: 'failed',
        complete: 'complete',
        running: 'running',
        parsing: 'parsing',
        waiting: 'waiting',
        waiting_analyzed: 'waiting_analyzed',
        uploading: 'uploading'
    }
};

module.exports = Jobs;
