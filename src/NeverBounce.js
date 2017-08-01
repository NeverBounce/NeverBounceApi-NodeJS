// Load lodash merge
const merge = require('lodash.merge');

// Load classes
const resources = {
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
    apiKey: null,
    timeout: 30000,
    opts: {
        host: 'api.neverbounce.com',
        port: 443,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
        }
    }
};

module.exports = NeverBounce;