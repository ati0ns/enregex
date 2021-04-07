declare module "enregex" {
    export default class Enregex extends RegExp {
        constructor(pattern: string | RegExp | any[], flags: String)

        /**
         * Builds a regex from more simple-to-understand format.
         * @example
         * console.log(Enregex.build("startsWith: 0 or abc or (def \\(ghi\\)); endsWith: 1 or ( smth ); src: (not-before(a)b or c not-after(d)) or group<abc>(abc)(repeat: <abc>, 2)", "abuuuismgadfge"))
         * // Enregex /^(?:0|abc|def \(ghi\))((?<!a)b|c(?!d))|group<abc>(abc)(repeat: <abc>, 2)(?:1| smth )$/gimsu
         */
        static build(source: string, flags?: string | string[]): Enregex

        /**
         * Develops a regex to all possible matched strings into an array of strings.
         * @example
         * console.log(new Enregex(/hello?/igm).array()) // (2) ['hello', 'hell]
         * console.log(new Enregex("hello?", "igm").array()) // (2) ['hello', "hell"]
         */
        array(): string[]

        /**
         * Returns a boolean whether the given argument includes the regex or not.
         * @example
         * console.log(new Enregex(/foobar/).includes("foobarfoobar")) // true
         * console.log(new Enregex(/foobar/).includes(["foo", "bar"])) // false
         */
        includes(toFind: string | string[]): boolean

        /**
         * Splits a regex into an array of regex by 'alternate' characters (`|`) in the main block.
         * @example
         * console.log(new Enregex(/(current)?song(info(rmation)?s?)?|chanson(actuelle)?|musique|現在の曲|genzai(-|_)?no(-|_)?kyoku|曲(情報)?|kyoku(-|_)?joho|canción((-|_)?(información|actual))?/i).split())
         * // (8) [/(current)?song(info(rmation)?s?)?/i, /chanson(actuelle)?/i, /musique/i, /現在の曲/i, /genzai(-|_)?no(-|_)?kyoku/i, /曲(情報)?/i, /kyoku(-|_)?joho/i, /canción((-|_)?(información|actual))?/i]
         */
        split(): Enregex[]
    }

    export const Enregex = Enregex

    export class Util {
        /**
         * Finds beacons and their content into an array.
         * @example
         * console.log(Util.beacons("-anchor There is a -tag rain-bow - \\-here. -a -b", { position: "start" }))
         * // (2) [ [ '-anchor', ' There is a' ], [ '-tag', ' rain-bow - \\-here.' ] ]
         * console.log(Util.beacons("-anchor: There is a: -tag rain-bow - \\:here. -a -b", { position: "end" }))
         * // (2) [ [ 'anchor:', ' There is' ], [ 'a:', ' -tag rain-bow - \\:here. -a -b' ] ]
         */
        static beacons(string: string, parameters?: beaconsParams, ...beacons: string[] | RegExp): string[][]

        /**
         * Returns URLs by given parameters.
         * @example
         * console.log(Util.checkURLs({ secured: !0, str: "There is a link <https://code.visualstudio.com/api/references/theme-color#peek-view-colors>." }))
         * // (1) ['https://code.visualstudio.com/api/references/theme-color#peek-view-colors']
         */
        static checkURLs(parameters: { blacklist?: string[], secured?: boolean, str: string, whitelist?: string[] }): string[] | null

        /**
         * Tells if a string or a line ends with the wanted string with the wanted options.
         * @example
         * console.log(Enregex.endsWith("Hello world!", "!", { flags: "i" }))
         * // true
         * console.log(Enregex.endsWith("Hello world?\nHello world!", "world!", { multiline: "one" }))
         * // true
         * console.log(Enregex.endsWith("Hello world!\nHello world...", "rld!", { multiline: "all" }))
         * // false
         */
        static endsWith(string: string, endsWith: string | string[], parameters?: endsWithParameters): boolean

        /**
         * Tells if a string or a line starts with the wanted string with the wanted options.
         * @example
         * console.log(Enregex.startsWith("Hello world!", "hello", { flags: "i" }))
         * // true
         * console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "one" }))
         * // true
         * console.log(Enregex.startsWith("Hello world!\nhello world!", "hello", { multiline: "all" }))
         * // false
         */
        static startsWith(string: string, startsWith: string | string[], parameters?: startsWithParameters): boolean
    }

    interface beaconsParams {
        ignore?: string | RegExp | string[] | RegExp[]
        position: "start" | "end"
        beaconBase?: string
    }

    interface endsWithParameters {
        flags?: string | string[]
        multiline?: "all" | "one"
    }

    interface startsWithParameters extends endsWithParameters { }
}