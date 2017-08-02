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
     * @returns {Promise.<*>}
     */
    create(input, inputlocation, filename, runsample, autoparse, autostart) {
        return this.request({
            method: 'POST',
            path: '/v4/jobs/create'
        }, {
            'input': input,
            'input_location': inputlocation,
            'filename': filename,
            'run_sample': runsample || null,
            'auto_start': autostart || null,
            'auto_parse': autoparse || null,
        }).then(
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
     * @returns {Promise.<*>}
     */
    start(jobid, runsample) {
        return this.request({
            method: 'POST',
            path: '/v4/jobs/start'
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
            path: '/v4/jobs/status'
        }, {
            'job_id': jobid,
        }).then(
            (resp) => Promise.resolve(resp),
            (e) => Promise.reject(e)
        )
    }

    /**
     * TODO
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

module.exports = Jobs;