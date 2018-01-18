const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce(require('../.env'));

// Search jobs
client.jobs.search({
//    'job_id': 10000, // Filter jobs based on id
//    'filename': 'Book1.csv', // Filter jobs based on filename
//    'job_status': NeverBounce.job.status.complete, // Show completed jobs only
//    'page': 1, // Page to start from
//    'items_per_page': 10, // Number of items per page
}).then(
    resp => {
        console.log('Job Returned: ' + resp.results.length);
        console.log('Job IDs: ' + resp.results.map(job => job.id));
    },
    err => console.log('ERROR: ' + err.message)
);