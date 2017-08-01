const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Verify an email
client.account.info().then(
    resp => console.log(resp),
    err => console.log("ERROR: " + err.message)
);