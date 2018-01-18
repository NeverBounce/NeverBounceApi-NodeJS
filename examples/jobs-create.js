const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Verify a list of emails
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
    NeverBounce.job.inputType.supplied, // Either `supplied` or `remote_url`
    'Created from Array.csv' // Friendly name that can be used to identify job
).then(
    resp => console.log('Job ID: ' + resp.job_id),
    err => console.log('ERROR: ' + err.message)
);