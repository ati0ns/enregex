"use strict"

const EnregexError = require("../rest/EnregexError.js")

module.exports = class Enregex extends RegExp {
    constructor(pattern, flags) {
        if (pattern instanceof Array) pattern = pattern.join("|")
        super(pattern, flags)
    }

    static beacons(str, params, ...bcns) {
        if (typeof str != "string") throw new EnregexError("string must be of type string")
        if (Array.isArray(bcns) && Array.isArray(bcns[0])) bcns = bcns.flat()
        if (typeof params != "object") params = {}
        const { ignore, position } = params
        if (!["start", "end"].includes(position)) throw new Error("params.position has wrong value")
        const beaconBase = params.beaconBase || (position == "end" ? ":" : "-"),

            match = str.match(position == "end" ? RegExp(`(\\b\\S+${beaconBase})\\s*((?:[^${beaconBase}]|(?<=\\W)${beaconBase}${Array.isArray(ignore) ? ignore[0] ? "|" + ignore.map(e => e instanceof RegExp ? e.source : e).join("|") : '' : ignore ? "|" + (ignore instanceof RegExp ? ignore.source : ignore) : ''})+)(?= +|$)`, "gim") : RegExp(`(\\B${beaconBase}\\S+)\\s*((?:[^${beaconBase}]|(?<=\\\\|\\S)${beaconBase}|${beaconBase}(?=\\s)${Array.isArray(ignore) ? ignore[0] ? "|" + ignore.map(e => e instanceof RegExp ? e.source : e).join("|") : '' : ignore ? "|" + (ignore instanceof RegExp ? ignore.source : ignore) : ''})+)(?= +|$)`, "gim")),
            res = match && match.map(m => position == "end" ? [m.slice(0, m.indexOf(beaconBase) + 1), m.slice(m.indexOf(" ", m.indexOf(beaconBase)) + 1)] : [m.slice(0, m.indexOf(" ")), m.slice(m.indexOf(" "))])
        return match && (Array.isArray(bcns) && bcns[0] ? res.filter(e => bcns[0] instanceof RegExp ? bcns[0].test(e[0]) : bcns.includes(e[0])) : res)
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
        let res = this.source.replace(/\(\?:/g, "(")
        const toAdd = []

        while (/\?|(?<!(?<!\\)\\(?:\\\\)*)\(/.test(res)) {
            res = res.replace(/(?<![^()|]+)\(([^|\n]+?)\)\??([^()\n]+)/g, (_, ...a) => a[0] + (a[1] ? "|" + a[0] + a[1] : '')).replace(/\(([^\n]+?)\)\??([^()|?\n][^()|\n]+)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + ")").replace(/(?:(?<!\(.*)([^(|\n]*?))\(([^(\n]+?)\)\??/g, (_, ...a) => "(" + Array.from({ length: a[1].split("|").length || 1 }, (_, i) => {
                const matched = res.match(/(?<!\(.*)([^(|\n]*?)\(([^(\n]+?)\)\??/g)
                if (matched && matched[0].endsWith("?") && !toAdd.includes(a[0])) toAdd.push(a[0])
                return a[0] + a[1].split("|")[i]
            }).join("|") + ")").replace(/(([^|()\n]+?)[^|()\n])\?/g, (_, ...a) => a[0] + "|" + a[1]).replace(/([^|()\n]+)\(([^()\n]+)\)/g, (_, ...a) => Array.from({ length: a[1].split("|").length || 1 }, (_, i) => a[0] + a[1].split("|")[i]).join("|"))
            res = res.replace(/\(([^()\n]+)\)([^|()\n?]+)\??/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + ")").replace(/\(([^()\n]+)\)(\??)\(([^()\n]+)\)(\??)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => {
                if (a[3])
                    for (const e of a[0].split("|"))
                        if (!/[()|?]/.test(e) && !toAdd.includes(e)) toAdd.push(e)
                return Array.from({ length: a[2].split("|").length || 1 }, (_, j) => a[0].split("|")[i] + a[2].split("|")[j]).join("|")
            }).join("|") + ")").replace(/\(([^()?]+)\)/g, "$1")
            while (/\(([^()|]+)\)/.test(res)) res = res.replace(/\(([^()|]+)\)/g, "$1")
        }

        const cache = []
        return JSON.parse('["' + res.replace(/(?<!(?<!\\)\\(?:\\\\)*)\|/g, '", "') + '"]').concat(toAdd).filter(e => {
            const eInCache = cache.includes(e)
            if (!eInCache) cache.push(e)
            return !eInCache
        })
    }

    includes(toFind) {
        if (typeof toFind != "string" && !Array.isArray(toFind)) throw new EnregexError("toFind must be of type string or instance of Array")
        return typeof toFind == "string" ? this.test(toFind) : toFind.map(e => this.test(e)).reduce((a, b) => a && b)
    }

    split() {
        return this.source.split(/(?<!\([^()]+)\|/).map(e => new Enregex(e, this.flags))
    }
}