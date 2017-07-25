'use strict';

// Load polyfill for older Node versions
Object.assign = Object.assign || require('es6-object-assign').assign;
var merge = require('lodash.merge');

/**
 * Default config values, these are overwritten when calling the constructor
 * @type {{apiKey: null, apiSecret: null, opts: {host: string, port: number, prefix: string, method: string, headers: {Content-Type: string, User-Agent: string}}}}
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

var resources = {
    Single: require('./Single')
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

    this.config = merge({}, NeverBounce.defaultConfig, config);
    this._prepResources();
}

NeverBounce.prototype = {
    /**
     * Returns config
     * @returns {*}
     */
    getConfig: function getConfig() {
        return Object.assign({}, this.config);
    },


    /**
     * Returns default config
     * @returns {*}
     */
    getDefaultConfig: function getDefaultConfig() {
        return Object.assign({}, NeverBounce.defaultConfig);
    },


    /**
     * Make our https request options
     * @param opts
     * @returns {*}
     */
    getRequestOpts: function getRequestOpts(opts) {
        return Object.assign({}, this.config.opts, opts);
    },


    /**
     * Set api key
     * @param key
     */
    setApiKey: function setApiKey(key) {
        this.config.apiKey = key;
    },


    /**
     * Set api url
     * @param host
     */
    setHost: function setHost(host) {
        this.config.opts.host = host;
    },


    /**
     * Loads resources (endpoints) into object
     * e.g. this.Single && this.Jobs
     * @private
     */
    _prepResources: function _prepResources() {
        for (var name in resources) {
            this[name[0].toLowerCase() + name.substring(1)] = new resources[name].client(this);
        }
    }
};

module.exports = NeverBounce;