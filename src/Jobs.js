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
            path: 'jobs/search'
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
            path: 'jobs/create'
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
            path: 'jobs/parse'
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
     * @returns {Promise.<*>}
     */
    start(jobid, runsample) {
        return this.request({
            method: 'POST',
            path: 'jobs/start'
        }, {
            'job_id': jobid,
            'run_sample': runsample || null,
        }).then(
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
            path: 'jobs/status'
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
            path: 'jobs/results'
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
            path: 'jobs/download'
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
            path: 'jobs/delete'
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
