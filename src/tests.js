const { Enregex, Util } = require("../src/index.js")

// console.log(new Enregex(/hello?/igm).array()) // (2) ['hello', 'hell']
// console.log(new Enregex("hello?", "igm").array()) // (2) ['hello', 'hell']

// console.log(new Enregex(/evals?|tests?/i).array)
// console.log(new Enregex(/guilds|serveu?rs/i).array)
// console.log(new Enregex(/helps?|aides?|cmds?|commande?s?/i).array)
// console.log(new Enregex(/hunts?|chasser?/i).array)
// console.log(new Enregex(/mar(?:ry|iée?)s?|(?:se(?:-|_)?)?marier/i).array)
// console.log(new Enregex(/perm(?:ission)?s?/).array)
// console.log(new Enregex(/profile?/i).array)
// console.log(new Enregex(/regexp?/i).array)
// console.log(new Enregex(/starts?|commencer?/i).array)
// console.log(new Enregex(/ab?(c?d?e)?hgi/i).array)
// console.log(new Enregex(/(af)b?(c?d?e)?h(gl)?i/i).array)
// console.log(new Enregex(/(abc)(de?f)?(g?hi)/i).array)

// console.log(new Enregex(/(current)?song(info(rmation)?s?)?|chanson(actuelle)?|musique|現在の曲|genzai(-|_)?no(-|_)?kyoku|曲(情報)?|kyoku(-|_)?joho|canción((-|_)?(información|actual))?/i).split())
// // (8) [/(current)?song(info(rmation)?s?)?/i, /chanson(actuelle)?/i, /musique/i, /現在の曲/i, /genzai(-|_)?no(-|_)?kyoku/i, /曲(情報)?/i, /kyoku(-|_)?joho/i, /canción((-|_)?(información|actual))?/i]

// console.log(Enregex.startsWith("Hello world!", "hello", { flags: "i" })) // true
// console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "one" })) // true
// console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "all" })) // false
// console.log(Enregex.startsWith("hello world!\nhEllo world!", ["hello", "h"], { multiline: "all" })) // (2) [false, true]

// console.log(new Enregex(/foobar/).includes("foobarfoobar")) // true
// console.log(new Enregex(/foobar/).includes(["foo", "bar"])) // false

// console.log(Util.beacons("-anchor There is a -tag rain-bow - \\-here. -a -b", { position: "start" }))
// // (2) [ [ '-anchor', ' There is a' ], [ '-tag', ' rain-bow - \\-here.' ] ]
// console.log(Util.beacons("-anchor: There is a: -tag rain-bow - \\:here. -a -b", { position: "end" }))
// // (2) [ [ 'anchor:', ' There is' ], [ 'a:', ' -tag rain-bow - \\:here. -a -b' ] ]

// console.log(Util.checkURLs({ secured: !0, str: "There is a link <https://code.visualstudio.com/api/references/theme-color#peek-view-colors>." }))
// // (1) ['https://code.visualstudio.com/api/references/theme-color#peek-view-colors']

console.log(Enregex.build("startsWith: 0 or abc or (def \\(ghi\\)); endsWith: 1 or ( smth ); src: (?:not-before(a)b or c not-after(d)) or group<abc>(abc)repeat: (<abc>, 2)", "abuuuismgadfge"))

setTimeout(() => 0, 5e3)