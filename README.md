# spread-the-word

> A Bonjour / Zeroconf implementation in TypeScript.

[![Github Version](https://img.shields.io/github/release/ardean/spread-the-word.svg)](https://github.com/ardean/spread-the-word)
[![NPM Version](https://img.shields.io/npm/v/spread-the-word.svg)](https://npmjs.org/package/spread-the-word)
[![NPM Downloads](https://img.shields.io/npm/dm/spread-the-word.svg)](https://npmjs.org/package/spread-the-word)
[![License](https://img.shields.io/npm/l/spread-the-word.svg)](LICENSE.md)
[![CircleCI](https://circleci.com/gh/ardean/spread-the-word.svg?style=svg)](https://circleci.com/gh/ardean/spread-the-word)

*Spread services across your local network and discover other services*

## Installation
```sh
$ npm i spread-the-word
```

## Usage
```js
import stw from "spread-the-word";

stw.on("up", (remoteService, response, referrer) => {
  console.log(`${remoteService.name} (type: ${remoteService.type}, port: ${remoteService.port}) is up (from ${referrer.address})`);
  if (remoteService.txt) {
    console.log("TXT found:", remoteService.txt);
  }
}).on("down", (remoteService, response, referrer) => {
  console.log(`${remoteService.name} (type: ${remoteService.type}, port: ${remoteService.port}) is down (from ${referrer.address})`);
});

stw.listen({ type: "jsremote" });

stw.spread({
  type: "jsremote",
  name: "awesome remote receiver",
  port: 4444,
  txt: {
    message: "Custom Data"
  }
});
```

## Features

- easy service detection & advertisement on your local network
- [TXT](https://tools.ietf.org/html/rfc6763#section-6) record support
  - used [encoder / decoder](https://www.npmjs.com/package/dns-txt)
- [subtypes](https://tools.ietf.org/html/rfc6763#section-7.1) support 
- auto [probing](https://tools.ietf.org/html/rfc6762#section-8.1) on spread
- no extra native dependencies
- typescript types included

## Documentation

You can find the latest version of documentation hosted [here](https://ardean.github.io/spread-the-word/index.html).

## Debug

```sh
$ DEBUG=SpreadTheWord:* npm start
```

## License

[MIT](LICENSE.md)