<p align="center"><img src="https://neverbounce-marketing.s3.amazonaws.com/neverbounce_color_600px.png"></p>

<p align="center">
<a href="https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS"><img src="https://travis-ci.org/NeverBounce/NeverBounceApi-NodeJS.svg" alt="Build Status"></a>
<a href="https://codeclimate.com/github/NeverBounce/NeverBounceApi-NodeJS"><img src="https://codeclimate.com/github/NeverBounce/NeverBounceApi-NodeJS/badges/gpa.svg" /></a>
<a href="https://www.npmjs.com/package/neverbounce"><img src="https://img.shields.io/npm/v/neverbounce.svg" /></a>
<a href="https://www.npmjs.com/package/neverbounce"><img src="https://img.shields.io/npm/dt/neverbounce.svg" /></a>
</p>

> Looking for the V3 API wrapper? Click [here](https://github.com/NeverBounce/NeverBounceApi-NodeJS/tree/v3).

This is the official NeverBounce API NodeJS wrapper. It provides helpful methods to quickly implement our API in your NodeJS applications.

**This package is not suitable for use in the browser! Only use it in server side applications!**

Installation
===

To install use the following command

```bash
$ npm install neverbounce --save
```

Basic Usage
---

```js
const NeverBounce = require('../src/NeverBounce.js');

// Initialize NeverBounce client
const client = new NeverBounce('secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

// Verify an email
client.single.check('support@neverbounce.com').then(
    result => {
        console.log('Result: ' + result.getResult());
    },
    err => console.log('ERROR: ' + err.message)
);
```

>**The API username and secret key used to authenticate V3 API requests will not work to authenticate V4 API requests.** If you are attempting to authenticate your request with the 8 character username or 12-16 character secret key the request will return an `auth_failure` error. The API key used for the V4 API will look like the following: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`. To create new V4 API credentials please go [here](https://app.neverbounce.com/apps/custom-integration/new).

For more information you can check out the `/examples` directory contained within the repository or visit our official documentation [here](https://developers.neverbounce.com/v4.0/reference).

Running Examples
---

There a several examples contained within the `/examples` directory included in this repo. To run these examples; first create a `.env.js` file in the project root containing the following text (substituting in your own API key):

```js
module.exports = {
  apiKey: 'secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
};
```

Once that file has been created you can run the examples with the following command, replacing the script name with the specific example you intend to run.

```bash
node ./examples/account-info.js
```
