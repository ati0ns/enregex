/* jshint esversion: 6 */
(() => {
	"use strict";

	class EnregexError extends Error {
		constructor(msg) {
			super(msg);
			this.name = "EnregexError";
		}
	}

	module.exports = EnregexError;
})();
