const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Verify an email
client.jobs.create(
    [
        {
            'id': '12345',
            'email': 'support@neverbounce.com',
            'name': 'Fred McValid'
        },
        {
            'id': '12346',
            'email': 'invalid@neverbounce.com',
            'name': 'Bob McInvalid'
        }
    ],
    'supplied',
    'Created from Array.csv'
).then(
    resp => console.log("Job ID: " + resp.job_id),
    err => console.log("ERROR: " + err.message)
);