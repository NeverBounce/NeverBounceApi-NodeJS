import NeverBounce from '../src/NeverBounce.js';
import dotenv from 'dotenv';
import { AccountInfoResponse } from '../src/types.js';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Get account info
client.account.info()
  .then((resp: AccountInfoResponse) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function getAccountInfo(): Promise<void> {
  try {
    const info: AccountInfoResponse = await client.account.info();
    console.log('[ASYNC] Account Info:', info);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

getAccountInfo();
