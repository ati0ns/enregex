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
* [\<Enregex>.startsWith()](https://github.com/ati0ns/enregex#enregex-startsWith)
* \<Enregex>.prototype
  * [\<Enregex>.prototype.array()](https://github.com/ati0ns/enregex#enregex-proto-array)
  * [\<Enregex>.prototype.split()](https://github.com/ati0ns/enregex#enregex-proto-split)

<h2 id="enregex-startsWith">&lt;Enregex&gt;.startsWith()</h2>

Returns a boolean whether true or false if a string or a line starts with the wanted string with the wanted options or not.
```js
Enregex.startsWith("foobar", "fOo", { flags: "i" })
// true
```

<h2 id="enregex-proto-array">&lt;Enregex&gt;.prototype.array()</h2>

Returns an array of strings (`Array<string>`) which can be matched by the regex.
```js
new Enregex(/foo(bar)?|bar?/).array()
// (4) ["foo", "foobar", "ba", "bar"]
```

<h2 id="enregex-proto-split">&lt;Enregex&gt;.prototype.split()</h2>

Returns an array of regex (`Array<Enregex>`) by the 'alternate' character.
```js
new Enregex(/foo|bar/i).split()
// (2) [/foo/i, /bar/i]
```