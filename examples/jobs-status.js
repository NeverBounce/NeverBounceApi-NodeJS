const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Get a jobs status
client.jobs.status(285186).then(
    resp => console.log(resp),
    err => console.log('ERROR: ' + err.message)
);