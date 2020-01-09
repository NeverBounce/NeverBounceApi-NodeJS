'use strict';

// Load lodash merge
const merge = require('lodash.merge');

// Load classes
const resources = {
    account: require('./Account'),
    jobs: require('./Jobs'),
    poe: require('./POE'),
    single: require('./Single'),
};

class NeverBounce {

    /**
     * Initializes NeverBounce object
     * @param config
     * @returns {NeverBounce}
     * @constructor
     */
    constructor(config) {
        this.config = merge({}, NeverBounce.defaultConfig, config);
        this._prepResources();
    }

    /**
     * Returns config
     * @returns {*}
     */
    getConfig() {
        return merge({}, this.config);
    }

    /**
     * Make our https request options
     * @param opts
     * @returns {*}
     */
    getRequestOpts(opts) {
        return merge({}, this.config.opts, opts);
    }

    /**
     * Set api key
     * @param key
     */
    setApiKey(key) {
        this.config.apiKey = key;
    }

    /**
     * Set api url
     * @param host
     */
    setHost(host) {
        this.config.opts.host = host;
    }

    /**
     * @param version
     */
    setApiVersion(version) {
        this.config.apiVersion = version;
    }

    /**
     * Loads resources (endpoints) into object
     * e.g. this.single && this.jobs
     * @private
     */
    _prepResources() {
        for (let name in resources) {
            this[
                name[0].toLowerCase() + name.substring(1)
            ] = new resources[name](this);
        }
    }
}

/**
 * Default config values, these are overwritten when calling the constructor
 */
NeverBounce.defaultConfig = {
    apiVersion: 'v4',
    apiKey: null,
    timeout: 30000,
    opts: {
        acceptedType: 'application/json',
        host: 'api.neverbounce.com',
        port: 443,
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
        }
    }
};

/**
 * @since 4.1.4
 * @type {{valid: number, invalid: number, disposable: number, catchall: number, unknown: number, flags: {has_dns: string, has_dns_mx: string, bad_syntax: string, free_email_host: string, profanity: string, role_account: string, disposable_email: string, government_host: string, academic_host: string, military_host: string, international_host: string, squatter_host: string, spelling_mistake: string, bad_dns: string, temporary_dns_error: string, connect_fails: string, accepts_all: string, contains_alias: string, contains_subdomain: string, smtp_connectable: string, spamtrap_network: string}}}
 */
NeverBounce.result = require('./VerificationObject').helpers;

/**
 * @since 4.1.4
 * @type {{inputType: {remote: string, supplied: string}, status: {under_review: string, queued: string, failed: string, complete: string, running: string, parsing: string, waiting: string, waiting_analyzed: string, uploading: string}}}
 */
NeverBounce.job = require('./Jobs').helpers;

/**
 * @since 4.1.4
 * @type {{AuthError: string, BadReferrerError: string, GeneralError: string, ThrottleError: string, _lut: {general_failure: string, auth_failure: string, bad_referrer: string, throttle_triggered: string}}}
 */
NeverBounce.errors = require('./Errors');

module.exports = NeverBounce;
