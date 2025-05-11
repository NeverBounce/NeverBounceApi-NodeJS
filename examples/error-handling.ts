import NeverBounce from '../src/NeverBounce.js';
import _Error from '../src/Errors.js';
import VerificationObject from '../src/VerificationObject.js';


// Initialize NeverBounce client
// api key has been intentionally left out to trigger an error
const client = new NeverBounce({});

// Verify an email
client.single.check('mike@neverbounce.com', true, true)
  .then((result: VerificationObject) => console.log('[THEN]', result))
  .catch((err: any) => {
    switch(err.type) {
      case NeverBounce.errors.AuthError:
        // The API credentials used are bad, have you reset them recently?
        console.log('[THEN]', err.message);
        break;
      case NeverBounce.errors.BadReferrerError:
        // The script is being used from an unauthorized source, you may need to
        // adjust your app's settings to allow it to be used from here
        console.log('[THEN]', err.message);
        break;
      case NeverBounce.errors.ThrottleError:
        // Too many requests in a short amount of time, try again shortly or adjust
        // your rate limit settings for this application in the dashboard
        console.log('[THEN]', err.message);
        break;
      case NeverBounce.errors.GeneralError:
        // A non recoverable API error occurred check the message for details
        console.log('[THEN]', err.message);
        break;
      default:
        // Other non specific errors
        console.log('[THEN]', err);
        break;
    }
  });

// Alternative using async/await
async function checkEmailWithErrorHandling(): Promise<void> {
  try {
    // This will fail due to missing API key
    const result = await client.single.check('mike@neverbounce.com', true, true);
    console.log('[ASYNC]', result);
  } catch (err) {
    if (err instanceof _Error) {
      switch(err.type) {
        case NeverBounce.errors.AuthError:
          console.log('[ASYNC] Auth Error:', err.message);
          break;
        case NeverBounce.errors.BadReferrerError:
          console.log('[ASYNC] Bad Referrer Error:', err.message);
          break;
        case NeverBounce.errors.ThrottleError:
          console.log('[ASYNC] Throttle Error:', err.message);
          break;
        case NeverBounce.errors.GeneralError:
          console.log('[ASYNC] General Error:', err.message);
          break;
        default:
          console.log('[ASYNC] Unknown Error Type:', err.message);
          break;
      }
    } else if (err instanceof Error) {
      console.log('[ASYNC] Standard Error:', err.message);
    } else {
      console.log('[ASYNC] Unknown Error:', err);
    }
  }
}

// Run the async version
checkEmailWithErrorHandling();
