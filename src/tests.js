/* eslint-disable @typescript-eslint/no-var-requires */
/* jshint esversion: 6 */
const { Enregex, Util } = require("../src/index.js");

new Enregex(/hello?/igm).array(); // (2) ['hello', 'hell']
new Enregex("hello?", "igm").array(); // (2) ['hello', 'hell']

new Enregex(/evals?|tests?/i).array();
new Enregex(/guilds|serveu?rs/i).array();
new Enregex(/helps?|aides?|cmds?|commande?s?/i).array();
new Enregex(/hunts?|chasser?/i).array();
new Enregex(/mar(?:ry|iée?)s?|(?:se(?:-|_)?)?marier/i).array();
new Enregex(/perm(?:ission)?s?/).array();
new Enregex(/profile?/i).array();
new Enregex(/regexp?/i).array();
new Enregex(/starts?|commencer?/i).array();
new Enregex(/ab?(c?d?e)?hgi/i).array();
new Enregex(/(af)b?(c?d?e)?h(gl)?i/i).array();
new Enregex(/(abc)(de?f)?(g?hi)/i).array();
new Enregex(/ray(?:-|_)?gifts?|gifts?(?:-|_)?ray/).array();

new Enregex(/(current)?song(info(rmation)?s?)?|chanson(actuelle)?|musique|現在の曲|genzai(-|_)?no(-|_)?kyoku|曲(情報)?|kyoku(-|_)?joho|canción((-|_)?(información|actual))?/i).split();
// (8) [/(current)?song(info(rmation)?s?)?/i, /chanson(actuelle)?/i, /musique/i, /現在の曲/i, /genzai(-|_)?no(-|_)?kyoku/i, /曲(情報)?/i, /kyoku(-|_)?joho/i, /canción((-|_)?(información|actual))?/i]

Util.startsWith("Hello world!", "hello", { flags: "i" }); // true
Util.startsWith("Hello world!\nhello world!", "hello", { multiline: "one" }); // true
Util.startsWith("Hello world!\nhello world!", "hello", { multiline: "all" }); // false
Util.startsWith("hello world!\nhEllo world!", ["hello", "h"], { multiline: "all" }); // (2) [false, true]

new Enregex(/foobar/).includes("foobarfoobar"); // true
new Enregex(/foobar/).includes(["foo", "bar"]); // false

Util.beacons("-anchor There is a -tag rain-bow - \\-here. -a -b", { position: "start" });
// (2) [ [ '-anchor', ' There is a' ], [ '-tag', ' rain-bow - \\-here.' ] ]
Util.beacons("-anchor: There is a: -tag rain-bow - \\:here. -a -b", { position: "end" });
// (2) [ [ 'anchor:', ' There is' ], [ 'a:', ' -tag rain-bow - \\:here. -a -b' ] ]

Util.checkURLs({ secured: !0, str: "There is a link <https://code.visualstudio.com/api/references/theme-color#peek-view-colors>." });
// (1) ['https://code.visualstudio.com/api/references/theme-color#peek-view-colors']

Util.factorize("2y - z * 2 | (4-z) (x/3 *  4) - (4-z)(1 / xy)");
// "2(y-z) | (4-z)((x/3 *  4)-(1 / xy))"

new Enregex(/abcdef/).merge(/a.?cdf/); // Enregex /ab?cde?f/
new Enregex(/abcdef/).merge(/a(.cde)?cdf/, "abcdefghi"); // Enregex /a(?:(?:(.cde)?|b)|b)cde?fghi/

console.log(Enregex.build("startsWith: 0 or abc or (def \\(ghi\\)); endsWith: 1 or ( smth ); src: (?:not-before(a)b or c not-after(d)) or group<abc>(abc)repeat: (<abc>, 2)", "abuuuismgadfge"));
// Enregex /^(?:0|abc|def \(ghi\))(?:(?<!a)b|c(?!d))|(abc)abc{2}(?:1| smth )$/gimsu

setTimeout(() => 0, 5e3);
