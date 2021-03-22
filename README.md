# enregex

## Installation

`npm install enregex` | `npm i enregex`

## Usages

```js
// ES5
const Enregex = require("enregex")
// ES6
import Enregex from "enregex"

// Creating an instance of Enregex by many ways:
// - using string:
new Enregex("foo", "igm")
// - using regex:
new Enregex(/bar/yu)
// - using array:
new Enregex(["hello", "world"])
```

## Enregex functions

* [\<Enregex>.beacons()](https://github.com/ati0ns/enregex#enregex-beacons)
* [\<Enregex>.endsWith()](https://github.com/ati0ns/enregex#enregex-endsWith)
* [\<Enregex>.startsWith()](https://github.com/ati0ns/enregex#enregex-startsWith)
* \<Enregex>.prototype
  * [\<Enregex>.prototype.array()](https://github.com/ati0ns/enregex#enregex-proto-array)
  * [\<Enregex>.prototype.includes()](https://github.com/ati0ns/enregex#enregex-proto-includes)
  * [\<Enregex>.prototype.split()](https://github.com/ati0ns/enregex#enregex-proto-split)

<h2 id="enregex-beacons">Enregex.beacons()</h2>

Finds beacons and their content into an array.

```js
console.log(Enregex.beacons("-anchor There is a -tag rain-bow - \\-here. -a -b", { position: "start" }))
// (2) [ [ '-anchor', ' There is a' ], [ '-tag', ' rain-bow - \\-here.' ] ]
```

<h2 id="enregex-endsWith">Enregex.endsWith()</h2>

Returns a boolean whether true or false if a string or a line ends with the wanted string with the wanted options or not.

```js
Enregex.endsWith("foobar", "bAr", { flags: "i" })
// true
```

<h2 id="enregex-startsWith">Enregex.startsWith()</h2>

Returns a boolean whether true or false if a string or a line starts with the wanted string with the wanted options or not.

```js
Enregex.startsWith("foobar", "fOo", { flags: "i" })
// true
```

<h2 id="enregex-proto-array">Enregex.prototype.array()</h2>

Returns an array of strings (`Array<string>`) which can be matched by the regex.

```js
new Enregex(/foo(bar)?|bar?/).array()
// (4) ["foo", "foobar", "ba", "bar"]
```

<h2 id="enregex-proto-includes">Enregex.prototype.includes()</h2>

Returns a boolean whether the given argument includes the regex or not.

```js
new Enregex(/foo(bar)?|bar?/).includes(["ba", "foobar"])
// true

new Enregex(/foo(bar)?|bar?/).includes(["bar", "fooba"])
// false
```

<h2 id="enregex-proto-split">Enregex.prototype.split()</h2>

Returns an array of regex (`Array<Enregex>`) by the 'alternate' character.

```js
new Enregex(/foo|bar/i).split()
// (2) [/foo/i, /bar/i]
```
