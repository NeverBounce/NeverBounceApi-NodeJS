import NeverBounce from '../src/NeverBounce.js';
import { JobResultsRequest, JobResultsResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Query parameters for job results
const query: Partial<JobResultsRequest> = {
  // page: 1, // Page to start from
  // per_page: 10, // Number of items per page
};

// Get job results
client.jobs.results(25999836, query)
  .then((resp: JobResultsResponse) => {
    console.log('[THEN] Results Count: ' + resp.results.length);
    console.log('[THEN] Results: ' + resp.results.map(result => 
      result.data.email + `(${result.verification.result})`
    ));
  })
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function getJobResults(jobId: number, options: Partial<JobResultsRequest> = {}): Promise<void> {
  try {
    const response = await client.jobs.results(jobId, options);
    
    console.log('[ASYNC] Job results retrieved successfully!');
    console.log(`[ASYNC] Total results: ${response.total_results}`);
    console.log(`[ASYNC] Total pages: ${response.total_pages}`);
    console.log(`[ASYNC] Current page: ${response.query.page}`);
    
    // Display the first few results
    if (response.results.length > 0) {
      console.log('\n[ASYNC] Sample results:');
      response.results.slice(0, 5).forEach((result, index) => {
        console.log(`[ASYNC] ${index + 1}. ${result.data.email} - Result: ${result.verification.result}`);
      });
    } else {
      console.log('[ASYNC] No results found.');
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error retrieving job results:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with a specific job ID
getJobResults(25999836, { page: 1, per_page: 10 });
