/**
 * Default config values, these are overwritten when calling the constructor
 * @type {{apiKey: null, apiSecret: null, opts: {host: string, port: number, prefix: string, method: string, headers: {Content-Type: string, User-Agent: string}}}}
 */
NeverBounce.defaultConfig = {
    apiKey: null,
    apiSecret: null,
    opts: {
        host: 'api.neverbounce.com',
        port: 443,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'NeverBounce-Node/' + require('../package.json').version
        }
    }
}

var resources = {
    Single: require('./Single'),
};

/**
 * Initializes NeverBounce object
 * @param config
 * @returns {NeverBounce}
 * @constructor
 */
function NeverBounce(config) {
    if (!(this instanceof NeverBounce)) {
        return new NeverBounce(config);
    }

    this.config = Object.assign({}, NeverBounce.defaultConfig, config);
    this._prepResources();
}

NeverBounce.prototype = {
    /**
     * Returns config
     * @returns {*}
     */
    getConfig () {
        return Object.assign({}, this.config);
    },

    /**
     * Returns default config
     * @returns {*}
     */
    getDefaultConfig () {
        return Object.assign({}, NeverBounce.defaultConfig);
    },

    /**
     * Make our https request options
     * @param opts
     * @returns {*}
     */
    getRequestOpts (opts) {
        return Object.assign({}, this.config.opts, opts);
    },

    /**
     * Set api key
     * @param key
     */
    setApiKey (key) {
        this.config.apiKey = key;
    },

    /**
     * Set api key
     * @param secret
     */
    setApiSecret (secret) {
        this.config.apiSecret = secret;
    },

    /**
     * Set api url
     * @param host
     */
    setHost (host) {
        this.config.opts.host = host;
    },

    /**
     * Sets api version
     * @param version
     */
    setVersion (version) {
        this.config.opts.prefix = '/' + version + '/';
    },

    _prepResources() {
        for (var name in resources) {
            this[
            name[0].toLowerCase() + name.substring(1)
                ] = new resources[name](this);
        }
    },
}

module.exports = NeverBounce;