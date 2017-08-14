const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Start job
client.poe.confirm('support@neverbounce.com', 'valid','e3173fdbbdce6bad26522dae792911f2', 'NBPOE-TXN-5942940c09669').then(
    resp => console.log(resp),
    err => console.log('ERROR: ' + err.message)
);