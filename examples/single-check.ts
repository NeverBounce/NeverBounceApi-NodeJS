import NeverBounce from '../src/NeverBounce.js';
import dotenv from 'dotenv';

// Load environment variables from .local.env file
dotenv.config();

// Example of using Promise-based approach with the NeverBounce API
const client = new NeverBounce({
  apiKey: process.env.NEVERBOUNCE_API_KEY
});

// Verify an email with address_info and credits_info
client.single.check('support@neverbounce.com', true, true)
  .then(result => {
    console.log('[THEN] Result: ' + result.getResult());
    console.log('[THEN] Result (numeric): ' + result.getNumericResult());
    console.log('[THEN] Is Valid? ' + result.is(NeverBounce.result.valid));
    
    // Access the response data with proper typing
    const response = result.getResponse();
    
    if (response.credits_info) {
      console.log('[THEN] Free Credits Used: ' + response.credits_info.free_credits_used);
      console.log('[THEN] Paid Credits Used: ' + response.credits_info.paid_credits_used);
    }
    
    if (response.address_info) {
      console.log('[THEN] Host: ' + response.address_info.host);
    }
  })
  .catch(err => {
    if (err instanceof Error) {
      console.log('[THEN] ERROR: ' + err.message);
    } else {
      console.log('[THEN] Unknown error occurred');
    }
  });

// Example of using async/await with the NeverBounce API
const runExample = async (): Promise<void> => {
  // Initialize NeverBounce client with API key from environment variables
  const client = new NeverBounce({
    apiKey: process.env.NEVERBOUNCE_API_KEY
  });

  try {
    // Verify an email with address_info and credits_info
    const result = await client.single.check('support@neverbounce.com', true, true);
    
    console.log('[ASYNC] Result: ' + result.getResult());
    console.log('[ASYNC] Result (numeric): ' + result.getNumericResult());
    console.log('[ASYNC] Is Valid? ' + result.is(NeverBounce.result.valid));
    
    // Access the response data with proper typing
    const response = result.getResponse();
    
    if (response.credits_info) {
      console.log('[ASYNC] Free Credits Used: ' + response.credits_info.free_credits_used);
      console.log('[ASYNC] Paid Credits Used: ' + response.credits_info.paid_credits_used);
    }
    
    if (response.address_info) {
      console.log('[ASYNC] Host: ' + response.address_info.host);
    }
  } catch (err) {
    // Type guard to check if it's our custom error type
    if (err instanceof Error) {
      console.log('[ASYNC] ERROR: ' + err.message);
    } else {
      console.log('[ASYNC] Unknown error occurred');
    }
  }
};

// Run the example
runExample().catch(err => {
  console.error('[ASYNC] Unhandled error:', err);
});
