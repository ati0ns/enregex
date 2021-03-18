"use strict"

module.exports = class EnregexError extends Error {
    constructor(msg) {
        super(msg)
        this.name = "EnregexError"
    }
}