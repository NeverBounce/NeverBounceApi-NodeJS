var https = require('https');
var qs = require('qs');

var hasOwn = {}.hasOwnProperty;

HttpsClient.extend = function(sub) {
    var Super = this;
    var Constructor = hasOwn.call(sub, 'constructor') ? sub.constructor : function() {
        Super.apply(this, arguments);
    };
    Constructor.prototype = Object.create(Super.prototype);
    for (var i in sub) {
        if (hasOwn.call(sub, i)) {
            Constructor.prototype[i] = sub[i];
        }
    }
    for (i in Super) {
        if (hasOwn.call(Super, i)) {
            Constructor[i] = Super[i];
        }
    }
    return Constructor;
};

function HttpsClient(_nb) {

    this.id = Math.random();
    this._nb = _nb;
    this.access_token = null;
};

HttpsClient.prototype = {

    /**
     * Make the actual request
     * @param endpoint
     * @param params
     */
    request(params, data) {
        return this.getAccessToken().then((token) => {
            data['access_token'] = token;
            return this._request(params, data);
        }).then((res) => {
            return Promise.resolve(res);
        })
    },

    /**
     * Performs actual requests
     * @param params
     * @param data
     * @returns {Promise}
     * @private
     */
    _request(params, data) {
        return new Promise((resolve, reject) => {
            var query = qs.stringify(data);
            var opts = this._nb.getRequestOpts(params);
            opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            opts.headers['Content-Length'] = Buffer.byteLength(query);

            var req = https.request(opts, (res) => {
                res.on('data', (chunk) => {
                    if(res.statusCode !== 200)
                        reject(chunk.toString('utf8'));

                    resolve(JSON.parse(chunk.toString('utf8')))
                });
            })

            req.write(query);
            req.end();

            req.on('error', (e) => {
                reject(e);
            })
        })
    },

    /**
     * Returns access token or retrieves existing access token
     * @returns {*}
     */
    getAccessToken() {
        if(this.access_token)
            return new Promise.resolve(this.access_token);

        return this._request({
            auth: this._nb.getConfig().apiKey + ':' + this._nb.getConfig().apiSecret,
            path: '/v3/access_token'
        }, {
            grant_type: 'client_credentials',
            scope: 'basic user'
        }).then(
            (res) => {
                this.access_token = res.access_token;
                return Promise.resolve(this.access_token);
            },
            (res) => {
                return Promise.reject(res);
            }
        )
    }
}

module.exports = HttpsClient;