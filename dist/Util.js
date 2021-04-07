"use strict"

const Enregex = require("./Enregex/Enregex.js"),
    EnregexError = require("./rest/EnregexError.js")

class Util {
    static beacons(str, params, ...bcns) {
        if (typeof str != "string") throw new EnregexError("'string' must be a string")
        if (Array.isArray(bcns) && Array.isArray(bcns[0])) bcns = bcns.flat()
        if (typeof params != "object") params = {}
        const { ignore, position } = params
        if (position != "start" && position != "end") throw new Error("'params.position' has wrong value")
        const beaconBase = params.beaconBase || (position == "end" ? ":" : "-"),

            match = str.match(position == "end" ? RegExp(`(\\b\\S+${beaconBase})\\s*((?:[^${beaconBase}]|(?<=\\W)${beaconBase}${Array.isArray(ignore) ? ignore[0] ? "|" + ignore.map(e => e instanceof RegExp ? e.source : e).join("|") : '' : ignore ? "|" + (ignore instanceof RegExp ? ignore.source : ignore) : ''})+)(?= +|$)`, "gim") : RegExp(`(\\B${beaconBase}\\S+)\\s*((?:[^${beaconBase}]|(?<=\\\\|\\S)${beaconBase}|${beaconBase}(?=\\s)${Array.isArray(ignore) ? ignore[0] ? "|" + ignore.map(e => e instanceof RegExp ? e.source : e).join("|") : '' : ignore ? "|" + (ignore instanceof RegExp ? ignore.source : ignore) : ''})+)(?= +|$)`, "gim")),
            res = match && match.map(m => position == "end" ? [m.slice(0, m.indexOf(beaconBase) + 1), m.slice(m.indexOf(" ", m.indexOf(beaconBase)) + 1)] : [m.slice(0, m.indexOf(" ")), m.slice(m.indexOf(" "))])
        return match && (Array.isArray(bcns) && bcns.length ? res.filter(e => bcns[0] instanceof RegExp ? bcns[0].test(e[0]) : bcns.includes(e[0])) : res)
    }

    static checkURLs({ wl, bl, secured = !1, str }) {
        if (typeof str != "string") throw new EnregexError("'string' must be a string")
        if (secured !== true && secured !== false) throw new EnregexError("'secured' must be a boolean")
        if (wl && wl.some(l => !/https?:\/\/(?:www\\.)?[a-z\d](?:[a-z\d-]{0,61})[a-z\d]?\.[a-z]{2,}(?:[^\s]+)?\b/.test(l))) throw new EnregexError("'whitelist' includes invalid link")
        if (bl && bl.some(l => !/https?:\/\/(?:www\\.)?[a-z\d](?:[a-z\d-]{0,61})[a-z\d]?\.[a-z]{2,}(?:[^\s]+)?\b/.test(l))) throw new EnregexError("'blacklist' includes invalid link")

        const found = str.match(new Enregex(`https${secured ? '' : "?"}:\\/\\/(?:www\\.)?[a-z\d](?:[a-z\\d-]{0,61})[a-z\\d]?\\.[a-z]{2,}(?:[^\\s]+)?\\b`, "ig"))
        if (!found) return null

        if (wl) return found.filter(e => wl.some(l => e.startsWith(l)))
        if (bl) return found.filter(e => !bl.some(l => e.startsWith(l)))
        return found
    }

    static endsWith(str, endsWith, params) {
        if (typeof params != "object") params = {}
        const { flags, multiline } = params,
        copyFlags = []

        if (flags && Array.isArray(flags)) flags = flags.join('')
        if (flags && (!flags.split('')[0] || flags.split('').some(e => !["g", "m", "i", "y", "u", "s"].includes(e) || copyFlags.includes(e) || copyFlags.push(e) && 0))) throw new EnregexError("'parameters.flags' has wrong value")
        if (multiline && multiline != "all" && multiline != "one") throw new EnregexError("'parameters.multiline' has wrong value")

        if (Array.isArray(endsWith)) {
            if (!endsWith.length) throw new EnregexError("'endsWith' must be not empty")
            return endsWith.map(e => multiline == "one" ? new Enregex(`${e}$`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`(?<!${e})$`, (flags || '') + (multiline ? "m" : '')).test(str))
        }
        return multiline == "one" ? new Enregex(`${endsWith}$`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`(?<!${endsWith})$`, (flags || '') + (multiline ? "m" : '')).test(str)
    }

    static startsWith(str, startsWith, params) {
        if (typeof params != "object") params = {}
        const { flags, multiline } = params,
        copyFlags = []

        if (flags && Array.isArray(flags)) flags = flags.join('')
        if (flags && (!flags.split('')[0] || flags.split('').some(e => !["g", "m", "i", "y", "u", "s"].includes(e) || copyFlags.includes(e) || copyFlags.push(e) && 0))) throw new EnregexError("'parameters.flags' has wrong value")
        if (multiline && multiline != "all" && multiline != "one") throw new EnregexError("'parameters.multiline' has wrong value")

        if (Array.isArray(startsWith)) {
            if (!startsWith.length) throw new EnregexError("'startsWith' must be not empty")
            return startsWith.map(e => multiline == "one" ? new Enregex(`^${e}`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`^(?!${e})`, (flags || '') + (multiline ? "m" : '')).test(str))
        }
        return multiline == "one" ? new Enregex(`^${startsWith}`, (flags || '') + (multiline ? "m" : '')).test(str) : !new Enregex(`^(?!${startsWith})`, (flags || '') + (multiline ? "m" : '')).test(str)
    }
}

module.exports = Util