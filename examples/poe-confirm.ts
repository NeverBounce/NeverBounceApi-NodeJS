import NeverBounce from '../src/NeverBounce.js';
import { POEConfirmationResponse } from '../src/types.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Initialize NeverBounce client with API key from environment variables
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Confirm POE (Proof of Email)
client.poe.confirm(
  'support@neverbounce.com',
  0, // Valid result code (0 = valid)
  'e3173fdbbdce6bad26522dae792911f2', // Confirmation token
  'NBPOE-TXN-5942940c09669' // Transaction ID
)
  .then((resp: POEConfirmationResponse) => console.log('[THEN]', resp))
  .catch((err: Error) => console.log('[THEN] ERROR: ' + err.message));

// Alternative using async/await
async function confirmPOE(
  email: string,
  result: number,
  confirmationToken: string,
  transactionId: string
): Promise<void> {
  try {
    const response = await client.poe.confirm(email, result, confirmationToken, transactionId);
    
    console.log('[ASYNC] POE confirmation successful!');
    console.log(`[ASYNC] Token confirmed: ${response.token_confirmed}`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('[ASYNC] Error confirming POE:', err.message);
    } else {
      console.error('[ASYNC] Unknown error occurred');
    }
  }
}

// Run the async version with specific parameters
confirmPOE(
  'support@neverbounce.com',
  0, // Valid result code (0 = valid)
  'e3173fdbbdce6bad26522dae792911f2', // Confirmation token
  'NBPOE-TXN-5942940c09669' // Transaction ID
);
