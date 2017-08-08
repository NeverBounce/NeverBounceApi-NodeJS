const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

const query = [];

// Download a list
client.jobs.download(285186, query).then(
    resp => console.log(resp),
    err => console.log('ERROR: ' + err.message)
);