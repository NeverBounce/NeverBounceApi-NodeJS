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
const client = new NeverBounce('Insert your API key');

// Verify an email
client.single.check('support@neverbounce.com').then(
    result => {
        console.log('Result: ' + result.getResult());
    },
    err => console.log('ERROR: ' + err.message)
);
```

For more information you can check out the `/examples` directory contained within the repository or visit our official documentation [here](https://developers.neverbounce.com/v4.0/reference).

Running Examples
---

There a several examples contained within the `/examples` directory included in this repo. To run these examples; first create a `.env.js` file in the project root containing the following text (substituting in your own API key):

```js
module.exports = {
  apiKey: 'Enter your api key here',
};
```

Once that file has been created you can run the examples with the following command, replacing the script name with the specific example you intend to run.

```bash
node ./examples/account-info.js
```