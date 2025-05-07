<p align="center"><img src="https://neverbounce-marketing.s3.amazonaws.com/neverbounce_color_600px.png"></p>

<p align="center">
<a href="https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS"><img src="https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS.svg" alt="Build Status"></a>
<a href="https://codeclimate.com/github/NeverBounce/NeverBounceApi-NodeJS"><img src="https://codeclimate.com/github/NeverBounce/NeverBounceApi-NodeJS/badges/gpa.svg" /></a>
<a href="https://www.npmjs.com/package/neverbounce"><img src="https://img.shields.io/npm/v/neverbounce.svg" /></a>
<a href="https://www.npmjs.com/package/neverbounce"><img src="https://img.shields.io/npm/dt/neverbounce.svg" /></a>
</p>

> Looking for the V4 API wrapper with JavaScript? Check out version 4.x.x.

This is the official NeverBounce API NodeJS wrapper. It provides helpful methods to quickly implement our API in your NodeJS applications. Version 5.0.0 has been completely rewritten in TypeScript and requires Node.js 20 or higher.

**This package is not suitable for use in the browser! Only use it in server side applications!**

## Breaking Changes in 5.0.0

- Requires Node.js 20 or higher
- Converted to TypeScript with full type definitions
- Uses ES Modules instead of CommonJS
- Uses modern fetch API instead of https module
- Improved error handling with proper TypeScript types

## Installation

To install use the following command:

```bash
$ npm install neverbounce --save
```

## Basic Usage

>**The API username and secret key used to authenticate V3 API requests will not work to authenticate V4 API requests.** If you are attempting to authenticate your request with the 8 character username or 12-16 character secret key the request will return an `auth_failure` error. The API key used for the V4 API will look like the following: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. To create new V4 API credentials please go [here](https://app.neverbounce.com/apps/custom-integration/new).

### Example with async/await

```ts
import NeverBounce from 'neverbounce';

// Initialize NeverBounce client
const client = new NeverBounce({apiKey: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'});

// Verify an email with async/await
async function verifyEmail() {
  try {
    // You can request additional information like address_info and credits_info
    const result = await client.single.check('support@neverbounce.com', true, true);
    
    console.log('Result: ' + result.getResult()); // prints: "valid"
    console.log('Result (numeric): ' + result.getNumericResult());
    console.log('Is Valid? ' + result.is(NeverBounce.result.valid));
    
    // Access the response data with proper typing
    const response = result.getResponse();
    
    if (response.address_info) {
      console.log('Host: ' + response.address_info.host);
    }
    
    if (response.credits_info) {
      console.log('Free Credits Used: ' + response.credits_info.free_credits_used);
      console.log('Paid Credits Used: ' + response.credits_info.paid_credits_used);
    }
  } catch (err) {
    // Errors are thrown and can be caught to handle specific error types
    if (err instanceof Error) {
      switch(err.type) {
        case NeverBounce.errors.AuthError:
          // The API credentials used are bad, have you reset them recently?
          break;
        case NeverBounce.errors.BadReferrerError:
          // The script is being used from an unauthorized source, you may need to
          // adjust your app's settings to allow it to be used from here
          break;
        case NeverBounce.errors.ThrottleError:
          // Too many requests in a short amount of time, try again shortly or adjust
          // your rate limit settings for this application in the dashboard
          break;
        case NeverBounce.errors.GeneralError:
          // A non recoverable API error occurred check the message for details
          break;
        default:
          // Other non specific errors
          console.error('Error:', err.message);
          break;
      }
    } else {
      console.error('Unknown error:', err);
    }
  }
}

verifyEmail();
```

### Example with Promises (then/catch)

```ts
import NeverBounce from 'neverbounce';

// Initialize NeverBounce client
const client = new NeverBounce({apiKey: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'});

// Verify an email with Promise syntax
client.single.check('support@neverbounce.com', true, true)
  .then(result => {
    console.log('Result: ' + result.getResult()); // prints: "valid"
    console.log('Result (numeric): ' + result.getNumericResult());
    console.log('Is Valid? ' + result.is(NeverBounce.result.valid));
    
    // Access the response data with proper typing
    const response = result.getResponse();
    
    if (response.address_info) {
      console.log('Host: ' + response.address_info.host);
    }
  })
  .catch(err => {
    // Handle errors with type checking
    if (err instanceof Error) {
      switch(err.type) {
        case NeverBounce.errors.AuthError:
          console.error('Auth Error:', err.message);
          break;
        case NeverBounce.errors.BadReferrerError:
          console.error('Bad Referrer Error:', err.message);
          break;
        case NeverBounce.errors.ThrottleError:
          console.error('Throttle Error:', err.message);
          break;
        case NeverBounce.errors.GeneralError:
          console.error('General Error:', err.message);
          break;
        default:
          console.error('Error:', err.message);
          break;
      }
    } else {
      console.error('Unknown error:', err);
    }
  });
```

For more information you can check out the `/examples` directory contained within the repository or visit our official documentation [here](https://developers.neverbounce.com/v4.2/reference).

Constants
---

The library exposes several constants that make working with jobs, verification results and errors easier. They can be accessed from the root `NeverBounce` object via the `result`, `job`, and `errors` properties.

## Running Examples

There are several examples contained within the `/examples` directory included in this repo. The examples are available in both JavaScript and TypeScript.

### Setting Up Environment Variables

The examples use environment variables for configuration. Create a `.env` file in the project root with the following content (substituting in your own API key):

```
NEVERBOUNCE_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Building and Running as JavaScript

Since the library is written in TypeScript, you'll need to compile it first to run the examples as JavaScript:

```bash
# Build the project
npm run build

# Run an example (after compilation)
node dist/examples/account-info.js
```

### Running TypeScript Examples

To run the TypeScript examples, use the `example` script with the path to the TypeScript example:

```bash
npm run example examples/single-check.ts
```

This will execute the TypeScript file directly using ts-node without requiring a separate compilation step.
