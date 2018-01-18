const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
// api key has been intentionally left out to trigger an error
const client = new NeverBounce({});

// Verify an email
client.single.check('mike@neverbounce.com', true, true).then(
    result => console.log(result),
    err => {
        switch(err.type) {
            case NeverBounce.errors.AuthError:
                // The API credentials used are bad, have you reset them recently?
                console.log(err.message);
                break;
            case NeverBounce.errors.BadReferrerError:
                // The script is being used from an unauthorized source, you may need to
                // adjust your app's settings to allow it to be used from here
                console.log(err.message);
                break;
            case NeverBounce.errors.ThrottleError:
                // Too many requests in a short amount of time, try again shortly or adjust
                // your rate limit settings for this application in the dashboard
                console.log(err.message);
                break;
            case NeverBounce.errors.GeneralError:
                // A non recoverable API error occurred check the message for details
                console.log(err.message);
                break;
            default:
                // Other non specific errors
                console.log(err);
                break;
        }
    }
);