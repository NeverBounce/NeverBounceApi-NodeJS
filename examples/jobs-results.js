const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Get job results
client.jobs.results(285186).then(
    resp => {
        console.log("Results Count: " + resp.results.length);
        console.log("Results: " + resp.results.map(result => result.data.email + `(${result.verification.result})`));
    },
    err => console.log("ERROR: " + err.message)
);