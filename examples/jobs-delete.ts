import NeverBounce from '../src/NeverBounce.js';
import { JobDeleteResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Delete a job
client.jobs.delete(25999818)
  .then((resp: JobDeleteResponse) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function deleteJob(jobId: number): Promise<void> {
  try {
    const result = await client.jobs.delete(jobId);
    console.log('[ASYNC] Job deleted successfully!');
    console.log('[ASYNC] status:', result.status);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error deleting job:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with a specific job ID
deleteJob(25999817);
