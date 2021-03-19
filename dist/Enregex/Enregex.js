"use strict"

const EnregexError = require("../rest/EnregexError.js")

module.exports = class Enregex extends RegExp {
    constructor(pattern, flags) {
        if (pattern instanceof Array) pattern = pattern.join("|")
        super(pattern, flags)
    }

    static endsWith(str, endsWith, params) {
        if (typeof params != "object") params = {}
        const { flags, multiline } = params,
            copyFlags = []

        if (flags && Array.isArray(flags)) flags = flags.join('')
        if (flags && (!flags.split('')[0] || flags.split('').some(e => !["g", "m", "i", "y", "u", "s"].includes(e) || copyFlags.includes(e) || copyFlags.push(e) && 0))) throw new EnregexError("wrong value for parameters.flags")
        if (multiline && !["all", "one"].includes(multiline)) throw new EnregexError("wrong value for parameters.multiline")

        if (Array.isArray(endsWith)) {
            if (!endsWith[0]) throw new EnregexError("endsWith must be not empty")
            return endsWith.map(e => multiline == "one" ? new Enregex(`${e}$`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`(?<!${e})$`, (flags || '') + (multiline ? "m" : '')).test(str))
        }
        return multiline == "one" ? new Enregex(`${endsWith}$`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`(?<!${endsWith})$`, (flags || '') + (multiline ? "m" : '')).test(str)
    }

    static startsWith(str, startsWith, params) {
        if (typeof params != "object") params = {}
        const { flags, multiline } = params,
            copyFlags = []

        if (flags && Array.isArray(flags)) flags = flags.join('')
        if (flags && (!flags.split('')[0] || flags.split('').some(e => !["g", "m", "i", "y", "u", "s"].includes(e) || copyFlags.includes(e) || copyFlags.push(e) && 0))) throw new EnregexError("wrong value for parameters.flags")
        if (multiline && !["all", "one"].includes(multiline)) throw new EnregexError("wrong value for parameters.multiline")

        if (Array.isArray(startsWith)) {
            if (!startsWith[0]) throw new EnregexError("startsWith must be not empty")
            return startsWith.map(e => multiline == "one" ? new Enregex(`^${e}`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`^(?!${e})`, (flags || '') + (multiline ? "m" : '')).test(str))
        }
        return multiline == "one" ? new Enregex(`^${startsWith}`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`^(?!${startsWith})`, (flags || '') + (multiline ? "m" : '')).test(str)
    }

    array() {
        let res = this.source
        const toAdd = []

        do {
            res = res.replace(/\(([^|\n]+?)\)\??([^()\n])/g, (_, ...a) => a[0] + (a[1] ? "|" + a[0] + a[1] : ''))
                .replace(/\(([^\n]+?)\)\??([^()|?\n][^()|\n]+)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + ")")
                .replace(/(?:(?<!\(.+)([^(|\n]*?))\(([^(\n]+?)\)\??/g, (_, ...a) => Array.from({ length: a[1].split("|").length }, (_, i) => {
                    const matched = res.match(/(?<!\(.*)([^(|\n]*?)\(([^(\n]+?)\)\??/g)
                    if (matched && matched[0].includes("?") && !toAdd.includes(a[0])) toAdd.push(a[0])
                    return a[0] + a[1].split("|")[i]
                }).join("|")).replace(/(([^|()\n]+?)[^|()\n])\?/g, (_, ...a) => a[0] + "|" + a[1])
        } while (res.includes("("))

        return JSON.parse('["' + res.replace(/(?<!(?<!\\)\\(?:\\\\)*)\|/g, '", "') + '"]').concat(toAdd)
    }

    split() {
        return this.source.split(/(?<!\([^()]+)\|/).map(e => new Enregex(e, this.flags))
    }
}