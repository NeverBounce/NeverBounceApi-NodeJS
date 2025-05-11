import NeverBounce from '../src/NeverBounce.js';
import { JobDownloadRequest } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Empty query object for download
const query: Partial<JobDownloadRequest> = {};

// Download a job's results
client.jobs.download(25999836, query)
  .then((resp: string) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function downloadJobResults(jobId: number): Promise<void> {
  try {
    const csvData = await client.jobs.download(jobId);
    console.log('[ASYNC] Job results downloaded successfully!');
    console.log('[ASYNC] CSV Data (first 100 chars):', csvData.substring(0, 100) + '...');
    
    // In a real application, you might want to save this to a file
    // For example:
    // import fs from 'fs';
    // fs.writeFileSync(`job-${jobId}-results.csv`, csvData);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error downloading job results:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with a specific job ID
downloadJobResults(25999835);
