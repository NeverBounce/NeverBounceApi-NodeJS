'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Load lodash merge
var merge = require('lodash.merge');

// Load classes
var resources = {
    account: require('./Account'),
    single: require('./Single')
};

var NeverBounce = function () {

    /**
     * Initializes NeverBounce object
     * @param config
     * @returns {NeverBounce}
     * @constructor
     */
    function NeverBounce(config) {
        _classCallCheck(this, NeverBounce);

        this.config = merge({}, NeverBounce.defaultConfig, config);
        this._prepResources();
    }

    /**
     * Returns config
     * @returns {*}
     */


    _createClass(NeverBounce, [{
        key: 'getConfig',
        value: function getConfig() {
            return merge({}, this.config);
        }

        /**
         * Make our https request options
         * @param opts
         * @returns {*}
         */

    }, {
        key: 'getRequestOpts',
        value: function getRequestOpts(opts) {
            return merge({}, this.config.opts, opts);
        }

        /**
         * Set api key
         * @param key
         */

    }, {
        key: 'setApiKey',
        value: function setApiKey(key) {
            this.config.apiKey = key;
        }

        /**
         * Set api url
         * @param host
         */

    }, {
        key: 'setHost',
        value: function setHost(host) {
            this.config.opts.host = host;
        }

        /**
         * Loads resources (endpoints) into object
         * e.g. this.single && this.jobs
         * @private
         */

    }, {
        key: '_prepResources',
        value: function _prepResources() {
            for (var name in resources) {
                this[name[0].toLowerCase() + name.substring(1)] = new resources[name](this);
            }
        }
    }]);

    return NeverBounce;
}();

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