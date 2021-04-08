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

* &lt;Enregex&gt;.prototype

  * [&lt;Enregex&gt;.prototype.array()](https://github.com/ati0ns/enregex#enregex-proto-array)
  * [&lt;Enregex&gt;.prototype.includes()](https://github.com/ati0ns/enregex#enregex-proto-includes)
  * [&lt;Enregex&gt;.prototype.split()](https://github.com/ati0ns/enregex#enregex-proto-split)
* [Util.beacons()](https://github.com/ati0ns/enregex#util-beacons)
* [Util.checkURLs()](https://github.com/ati0ns/enregex#util-checkURLs)
* [Util.endsWith()](https://github.com/ati0ns/enregex#util-endsWith)
* [Util.startsWith()](https://github.com/ati0ns/enregex#util-startsWith)

<h2 id="enregex-proto-array">&lt;Enregex&gt;.prototype.array()</h2>

Returns an array of strings (`Array<string>`) which can be matched by the regex.

```js
new Enregex(/foo(bar)?|bar?/).array()
// (4) ["foo", "foobar", "ba", "bar"]
```

<h2 id="enregex-proto-includes">&lt;Enregex&gt;.prototype.includes()</h2>

Returns a boolean whether the given argument includes the regex or not.

```js
new Enregex(/foo(bar)?|bar?/).includes(["ba", "foobar"])
// true

new Enregex(/foo(bar)?|bar?/).includes(["bar", "fooba"])
// false
```

<h2 id="enregex-proto-split">&lt;Enregex&gt;.prototype.split()</h2>

Returns an array of regex (`Array<Enregex>`) by the 'alternate' character.

```js
new Enregex(/foo|bar/i).split()
// (2) [/foo/i, /bar/i]
```

<h2 id="util-beacons">Util.beacons()</h2>

Finds beacons and their content into an array.

```js
console.log(Util.beacons("-anchor There is a -tag rain-bow - \\-here. -a -b", { position: "start" }))
// (2) [ [ '-anchor', ' There is a' ], [ '-tag', ' rain-bow - \\-here.' ] ]
```

<h2 id="util-checkURLs">Util.checkURLs()</h2>

Returns URLs by given parameters.

```js
console.log(Util.checkURLs({ secured: !0, str: "There is a link [https://code.visualstudio.com/api/references/theme-color#peek-view-colors](https://code.visualstudio.com/api/references/theme-color#peek-view-colors)." }))
// (1) ['https://code.visualstudio.com/api/references/theme-color#peek-view-colors']
```


<h2 id="util-endsWith">Util.endsWith()</h2>

Returns a boolean whether true or false if a string or a line ends with the wanted string with the wanted options or not.

```js
Util.endsWith("foobar", "bAr", { flags: "i" })
// true
```


<h2 id="util-startsWith">Util.startsWith()</h2>

Returns a boolean whether true or false if a string or a line starts with the wanted string with the wanted options or not.

```js
Util.startsWith("foobar", "fOo", { flags: "i" })
// true
```
