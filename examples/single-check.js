const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Verify an email
client.single.check('mike@neverbounce.com', true, true).then(
    result => {
        console.log('Result: ' + result.getResult());
        console.log('Result (numeric): ' + result.getNumericResult());
        console.log('Is Valid? ' + result.is(NeverBounce.result.valid));
        console.log('Free Credits Used: ' + result.response.credits_info.free_credits_used);
        console.log('Paid Credits Used: ' + result.response.credits_info.paid_credits_used);
        console.log('Host: ' + result.response.address_info.host);
    },
    err => console.log('ERROR: ' + err.message)
);