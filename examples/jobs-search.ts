import NeverBounce from '../src/NeverBounce.js';
import { JobSearchRequest, JobSearchResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Search parameters
const searchParams: JobSearchRequest = {
  // job_id: 10000, // Filter jobs based on id
  // page: 1, // Page to start from
  // per_page: 10, // Number of items per page
};

// Search jobs
client.jobs.search(searchParams)
  .then((resp: JobSearchResponse) => {
    console.log('[THEN] Jobs Returned: ' + resp.results.length);
    console.log('[THEN] Job IDs: ' + resp.results.map(job => job.id));
  })
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function searchJobs(params: JobSearchRequest = {}): Promise<void> {
  try {
    const response = await client.jobs.search(params);
    
    console.log('[ASYNC] Jobs search completed successfully!');
    console.log(`[ASYNC] Total jobs found: ${response.total_results}`);
    console.log(`[ASYNC] Total pages: ${response.total_pages}`);
    console.log(`[ASYNC] Current page: ${response.query.page}`);
    
    // Display the jobs
    if (response.results.length > 0) {
      console.log('\n[ASYNC] Jobs:');
      response.results.forEach((job, index) => {
        console.log(`[ASYNC] ${index + 1}. ID: ${job.id}, Filename: ${job.filename}, Status: ${job.job_status}`);
        console.log(`[ASYNC]    Created: ${job.created_at}, Total: ${job.total}, Processed: ${job.total.processed}`);
        console.log(`[ASYNC]    Valid: ${job.total.valid}, Invalid: ${job.total.invalid}, Catchall: ${job.total.catchall}, Disposable: ${job.total.disposable}, Unknown: ${job.total.unknown}`);
        console.log('[ASYNC] ---');
      });
    } else {
      console.log('[ASYNC] No jobs found.');
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error searching jobs:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with specific search parameters
searchJobs({ page: 1, per_page: 5 });
