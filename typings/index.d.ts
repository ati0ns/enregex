declare module "enregex" {
    export default class Enregex extends RegExp {
        constructor(pattern: string | RegExp | any[], flags: String)

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
        static endsWith(string: string, endsWith: string | string[], parameters?: startsOrEndsWithParameters): boolean

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
        static startsWith(string: string, startsWith: string | string[], parameters?: startsOrEndsWithParameters): boolean

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
        split(): RegExp[]
    }

    interface startsOrEndsWithParameters {
        flags?: string | string[]
        multiline?: "all" | "one"
    }
}