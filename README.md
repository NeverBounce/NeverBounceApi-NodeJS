NeverBounce API NodeJS Wrapper
---
[![Build Status](https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS.svg?branch=master)](https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS)

This is the official NeverBounce API NodeJS wrapper. It provides helpful methods to quickly implement our API in your NodeJS applications.

Installation
===

To install use the following command

```
$ npm install neverbounce --save
```

Usage
===

To start using the wrapper sign up for an account [here](https://app.neverbounce.com/register) and get your api keys [here](https://app.neverbounce.com/settings/api). This wrapper utilizes ES6 Promises to handle the API calls.

To initialize the wrapper use the following snippet, substituting in your `api key` and `api secrete key`...

```
var NeverBounce = require('neverbounce')({
    apiKey: API_KEY,
    apiSecret: API_SECRET_KEY
});
```

You can now access the verify method from this object. To validate a single email use the following...

```
NeverBounce.single.verify(EMAIL_TO_VALIDATE).then(
    function(result) {
        // do stuff
    }
)
```

The `result` returned in from the verification promise will be a `Result` object. It provides several helper methods documented below...

```
result.getResult(); // Numeric result code; ex: 0, 1, 2, 3, 4
result.getResultTextCode(); // Textual result code; ex: valid, invalid, disposable, catchall, unknown
result.is(0); // Returns true if result is valid
result.is([0,3,4]); // Returns true if result is valid, catchall, or unknown
result.not(1); // Returns true if result is not invalid
result.not([1,2]); // Returns true if result is not invalid or disposable
```
