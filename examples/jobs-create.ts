import NeverBounce from '../src/NeverBounce.js';
import { JobCreationResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Verify a list of emails
client.jobs.create(
  [
    {
        id: '12345',
        email: 'support@neverbounce.com',
        name: 'Fred McValid'
    },
    {
        id: '12346',
        email: 'invalid@neverbounce.com',
        name: 'Bob McInvalid'
    }
],
  NeverBounce.job.inputType.supplied, // Either `supplied` or `remote_url`
  'Created from Array.csv', // Friendly name that can be used to identify job
  false,
  true,
)
  .then((resp: JobCreationResponse) => console.log('[THEN] Job ID: ' + resp.job_id))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function createJob(): Promise<void> {
  try {
    const emails: any[] =  [
      {
          id: '12345',
          email: 'support@neverbounce.com',
          name: 'Fred McValid'
      },
      {
          id: '12346',
          email: 'invalid@neverbounce.com',
          name: 'Bob McInvalid'
      }
  ];
    const result = await client.jobs.create(
      emails,
      NeverBounce.job.inputType.supplied,
      'Created from Array.csv',
      false,
      true,
    );

    console.log('[ASYNC] Job created successfully!');
    console.log('[ASYNC] Job ID:', result.job_id);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error creating job:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version
createJob();
