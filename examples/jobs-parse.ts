import NeverBounce from '../src/NeverBounce.js';
import { ApiResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Parse a job
client.jobs.parse(25999824)
  .then((resp: ApiResponse) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function parseJob(jobId: number): Promise<void> {
  try {
    const result = await client.jobs.parse(jobId);
    console.log('[ASYNC] Job parsing initiated successfully!');
    console.log('[ASYNC] Response:', result);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error parsing job:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with a specific job ID
parseJob(25999825);
