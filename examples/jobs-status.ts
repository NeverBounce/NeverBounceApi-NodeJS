import NeverBounce from '../src/NeverBounce.js';
import { JobStatusResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Get a job's status
client.jobs.status(25999836)
  .then((resp: JobStatusResponse) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function checkJobStatus(jobId: number): Promise<void> {
  try {
    const status = await client.jobs.status(jobId);
    
    console.log('[ASYNC] Job status retrieved successfully!');
    console.log(`[ASYNC] Job ID: ${status.id}`);
    console.log(`[ASYNC] Filename: ${status.filename}`);
    console.log(`[ASYNC] Status: ${status.job_status}`);
    console.log(`[ASYNC] Created: ${status.created_at}`);
    console.log(`[ASYNC] Started: ${status.started_at || 'Not started'}`);
    console.log(`[ASYNC] Finished: ${status.finished_at || 'Not finished'}`);
    console.log(`[ASYNC] Progress: ${status.percent_complete}%`);
    
    console.log('\n[ASYNC] Counts:');
    console.log(`[ASYNC] Total: ${status.total}`);
    console.log(`[ASYNC] Processed: ${status.total.processed}`);
    console.log(`[ASYNC] Valid: ${status.total.valid}`);
    console.log(`[ASYNC] Invalid: ${status.total.invalid}`);
    console.log(`[ASYNC] Catchall: ${status.total.catchall}`);
    console.log(`[ASYNC] Disposable: ${status.total.disposable}`);
    console.log(`[ASYNC] Unknown: ${status.total.unknown}`);
    console.log(`[ASYNC] Duplicates: ${status.total.duplicates}`);
    
    if (status.failure_reason) {
      console.log(`\n[ASYNC] Failure reason: ${status.failure_reason}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error checking job status:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with a specific job ID
checkJobStatus(25999836);
