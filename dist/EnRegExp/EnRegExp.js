"use strict"

module.exports = class EnRegExp extends RegExp {
    constructor(pattern, flags) {
        if (pattern instanceof Array) pattern = pattern.join("|")
        super(pattern, flags)
    }

    array() {
        let res = this.toString().split("/")[1]
        const toAdd = []

        do {
            res = res.replace(/\(([^|\n]+?)\)\??([^()\n])/g, (_, ...a) => a[0] + (a[1] ? "|" + a[0] + a[1] : '')).replace(/\(([^\n]+?)\)\??([^()|?\n][^()|\n]+)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + ")").replace(/(?:(?<!\(.+)([^(|\n]*?))\(([^(\n]+?)\)\??/g, (_, ...a) => Array.from({ length: a[1].split("|").length }, (_, i) => {
                const matched = res.match(/(?<!\(.*)([^(|\n]*?)\(([^(\n]+?)\)\??/g)
                if (matched && matched[0].includes("?") && !toAdd.includes(a[0])) toAdd.push(a[0])
                return a[0] + a[1].split("|")[i]
            }).join("|")).replace(/(([^|()\n]+?)[^|()\n])\?/g, (_, ...a) => a[0] + "|" + a[1])
        } while (res.includes("("))

        return JSON.parse('["' + res.replace(/(?<!(?<!\\)\\(?:\\\\)*)\|/g, '", "') + '"]').concat(toAdd)
    }
}