"use strict"

const EnregexError = require("../rest/EnregexError.js")

class Enregex extends RegExp {
    constructor(pattern, flags) {
        if (pattern instanceof Array) pattern = pattern.join("|")
        super(pattern, flags)
    }

    static build(src, flags) {
        if (typeof flags != "string" && !Array.isArray(flags)) flags = []

        const rx = ['', '', '']

        if (/(?:^|; *)startsWith *: *((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: +or +(?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/.test(src)) rx[0] = `^(?:${src.match(/(?:^|; *)startsWith *: *((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: +or +(?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/)[1].split(/ +or +/).join("|").replace(/(?<!\\)\(|(?<!\\)\)/g, '')})`
        if (/(?:^|; *)endsWith *: *((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: +or +(?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/.test(src)) rx[2] = `(?:${src.match(/(?:^|; *)endsWith *: *((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: +or +(?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/)[1].split(/ +or +/).join("|").replace(/(?<!\\)\(|(?<!\\)\)/g, '')})$`
        if (/(?:^|; *)(?:src|source) *: *[^]+/) rx[1] = src.match(/(?<=(?:^|; *)(?:src|source) *:)[^]+/)[0].trimStart().replace(/ +or +/g, "|")

        let groups = rx[1].match(/group<[a-zA-Z\d]+>\([^]*\)/g)
        rx[1] = rx[1].replace(/group<[a-zA-Z\d]+>\(([^]*)\)/g, "($1)")
        groups = groups && [...new Set(groups)]
        const groupsValues = {}

        for (const i in groups) {
            const [groupName, groupValue] = groups[i].match(/group<([a-zA-Z\d]+)>\(([^()]*)\)/).slice(1)
            if (groupValue.startsWith("?")) throw new EnregexError(`invalid regex inside of the group ${i + 1}`)
            groupsValues[groupName] = groupValue
            rx[1].replace(groups[i], `(${groupValue})`)
        }

        rx[1] = rx[1].replace(/;? *not-before *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*)\)/g, "(?<!$1)")
            .replace(/;? *not-after *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*)\)/g, "(?!$1)")
            .replace(/(?<!(?<!\\)\\(?:\\\\)*)<([a-zA-Z\d]+)>/g, (_, ...a) => groupsValues[a[0]])
            .replace(/;? *repeat: *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*) *, *(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*))\)/g, "$1{$2}")

        return new Enregex(rx.join(''), (typeof flags == "string" ? flags.split('') : flags).reduce((a, b) => a + (a.includes(b) || !"gimusy".includes(b) ? '' : b), ''))
    }

    array() {
        let res = rx.source.replace(/\(\?:/g, "(")
        const toAdd = []

        while (/\?|(?<!(?<!\\)\\(?:\\\\)*)\(/.test(res)) {
            res = res.replace(/(?<![^()|]+)\(([^|\n]+?)\)\??([^()\n]+)/g, (_, ...a) => a[0] + (a[1] ? "|" + a[0] + a[1] : ''))
                .replace(/([^|()\n?]*)\(([^\n]+?)\)(\??)([^()|?\n]+)(\??)/g, (_, ...a) => "(" + Array.from({ length: a[1].split("|").length }, (_, i) => {
                    console.log(a[2], a[4])
                    if (a[2] && !toAdd.includes(a[0] + a[3])) toAdd.push(a[0] + a[3])
                    if (a[4] && !toAdd.includes(a[0] + a[1].split("|")[i])) toAdd.push(a[0] + a[1].split("|")[i].replace(/\?/g, ''))
                    if (a[2] && a[4] && !toAdd.includes(a[0])) toAdd.push(a[0])
                    return a[0] + a[1].split("|")[i] + a[3]
                }).join("|") + ")")
                .replace(/(?:(?<!\(.*)([^(|\n]*?))\(([^(\n]+?)\)\??/g, (_, ...a) => "(" + Array.from({ length: a[1].split("|").length || 1 }, (_, i) => {
                    const matched = res.match(/(?<!\(.*)([^(|\n]*?)\(([^(\n]+?)\)\??/g)
                    if (matched && matched[0].endsWith("?") && !toAdd.includes(a[0])) toAdd.push(a[0])
                    return a[0] + a[1].split("|")[i]
                }).join("|") + ")")
                .replace(/(([^|()\n]+?)[^|()\n])\?([^|()\n]*)/g, (_, ...a) => a[0] + a[2] + "|" + a[1] + a[2])
                .replace(/([^|()\n]+)\(([^()\n]+)\)/g, (_, ...a) => Array.from({ length: a[1].split("|").length || 1 }, (_, i) => a[0] + a[1].split("|")[i]).join("|"))
                .replace(/\(([^()\n]+)\)([^|()\n?]+)\??/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + ")")
                .replace(/\(([^()\n]+)\)(\??)\(([^()\n]+)\)(\??)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => {
                    if (a[3])
                        for (const e of a[0].split("|"))
                            if (!/[()|?]/.test(e) && !toAdd.includes(e)) toAdd.push(e)
                    return Array.from({ length: a[2].split("|").length || 1 }, (_, j) => a[0].split("|")[i] + a[2].split("|")[j]).join("|")
                }).join("|") + ")")
                .replace(/\(([^()?]+)\)/g, "$1")
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
        if (typeof toFind != "string" && !Array.isArray(toFind)) throw new EnregexError("'toFind' must be a string or instance of Array")
        return typeof toFind == "string" ? this.test(toFind) : toFind.map(e => this.test(e)).reduce((a, b) => a && b)
    }

    split() {
        return this.source.split(/(?<!\([^()]+)\|/).map(e => new Enregex(e, this.flags))
    }
}

module.exports = Enregex