const Enregex = require("../src/index.js")

console.log(new Enregex(/hello?/igm).array()) // (2) ['hello', 'hell']
console.log(new Enregex("hello?", "igm").array()) // (2) ['hello', 'hell']

console.log(new Enregex(/(current)?song(info(rmation)?s?)?|chanson(actuelle)?|musique|現在の曲|genzai(-|_)?no(-|_)?kyoku|曲(情報)?|kyoku(-|_)?joho|canción((-|_)?(información|actual))?/i).split())
// (8) [/(current)?song(info(rmation)?s?)?/i, /chanson(actuelle)?/i, /musique/i, /現在の曲/i, /genzai(-|_)?no(-|_)?kyoku/i, /曲(情報)?/i, /kyoku(-|_)?joho/i, /canción((-|_)?(información|actual))?/i]

console.log(Enregex.startsWith("Hello world!", "hello", { flags: "i" })) // true
console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "one" })) // true
console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "all" })) // false
console.log(Enregex.startsWith("hello world!\nhEllo world!", ["hello", "h"], { multiline: "all" })) // (2) [false, true]

setTimeout(() => 0, 5e3)