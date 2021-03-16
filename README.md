# EnRegExp?

## Installation
`npm install enregex` | `npm i enregex`

## Usages
```js
// ES5
const EnRegExp = require("enregex")
// ES6
import EnRegExp from "enregex"

// Creating an instance of EnRegExp by many ways:
// - using string:
new EnRegExp("foo", "igm")
// - using regex:
new EnRegExp(/bar/yu)
// - using array:
new EnRegExp(["hello", "world"])
```

## EnRegExp functions
* [\<EnRegExp>.array()](https://github.com/ati0ns/enregex#enregex-array)

<h2 id="enregex-array">&lt;EnRegExp&gt;.array()</h2>

Returns an array of strings (`Array<string>`) which can be matched by the regex.
```js
new EnRegExp(/foo(bar)?|bar?/).array()
// (4) ["foo", "foobar", "ba", "bar"]
```