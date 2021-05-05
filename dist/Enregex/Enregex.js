/* eslint-disable @typescript-eslint/no-var-requires */
/* jshint esversion: 6 */
const EnregexError = require("../rest/EnregexError.js"),
	arrayGetterFn = rx => {
		let res = typeof rx == "string" ? rx : rx.source.replace(/\(\?:/g, "(");
		const toAdd = [];

		while (/\?|(?<!(?<!\\)\\(?:\\\\)*)\(/.test(res)) {
			res = res.replace(/\(([^()\n]+)\)(\??)\(([^()\n]+)\)(\??)([^]*)/g, (_, ...a) => {
				if (a[1] && !a[4]) toAdd.push(...arrayGetterFn(a[2]));
				if (a[3] && !a[4]) toAdd.push(...arrayGetterFn(a[0]));
				return a[0] + a[2] + a[4];
			});
			res = res.replace(/(?<![^()|]+)\(([^()|\n]+?)\)(\??)([^()\n]+)([^]*)/g, (_, ...a) => a[0] + a[2] + a[3] + (a[1] ? "|" + a[2] + a[3] : ''));
			res = res.replace(/([^]*)([^()\n]+)\(([^|\n]+?)\)(\??)([^\n]+)/g, (_, ...a) => a[0] + a[1] + a[2] + a[4] + (a[3] ? "|" + a[0] + a[1] + a[4] : ''));
			res = res.replace(/([^|()\n]*)\(([^()\n]+?)\)(\??)([^|()\n]+)/g, (_, ...a) => "(" + Array.from({ length: a[1].split("|").length || 1 }, (_, i) => {
				if (a[2] && a[3] && !toAdd.includes(a[0] + a[3])) toAdd.push(...arrayGetterFn(a[0] + a[3]));
				if (a[2] && !toAdd.includes(a[0])) toAdd.push(...arrayGetterFn(a[0] + a[3]));
				return a[0] + a[1].split("|")[i] + a[3];
			}).join("|") + ")");
			res = res.replace(/(?:(?<!\(.*)([^(|\n]*?))\(([^(\n]+?)\)(\??)/g, (_, ...a) => "(" + Array.from({ length: a[1].split("|").length || 1 }, (_, i) => {
				if (a[2] && !toAdd.includes(a[0])) toAdd.push(...arrayGetterFn(a[0]));
				return a[0] + a[1].split("|")[i];
			}).join("|") + ")");
			res = res.replace(/(([^|()\n]+?)[^|()\n])\?([^|()\n]*)/g, (_, ...a) => a[0] + a[2] + "|" + a[1] + a[2]);
			res = res.replace(/([^|()\n]+)\(([^()\n]+)\)/g, (_, ...a) => Array.from({ length: a[1].split("|").length || 1 }, (_, i) => a[0] + a[1].split("|")[i]).join("|"));
			res = res.replace(/\(([^()\n]+)\)([^|()\n?]+)\??([^\n]*)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => a[0].split("|")[i] + a[1]).join("|") + a[2] + ")");
			res = res.replace(/\(([^()\n]+)\)(\??)\(([^()\n]+)\)(\??)/g, (_, ...a) => "(" + Array.from({ length: a[0].split("|").length || 1 }, (_, i) => {
				if (a[3]) for (const e of a[0].split("|")) if (!/[()|?]/.test(e) && !toAdd.includes(e)) toAdd.push(...arrayGetterFn(e));
				return Array.from({ length: a[2].split("|").length || 1 }, (_, j) => a[0].split("|")[i] + a[2].split("|")[j]).join("|");
			}).join("|") + ")");
			res = res.replace(/\(([^()?]+)\)/g, "$1");
			while (/\(([^()|]+)\)/.test(res)) res = res.replace(/\(([^()|]+)\)/g, "$1");
		}

		const cache = [];
		return JSON.parse('["' + res.replace(/(?<!(?<!\\)\\(?:\\\\)*)\|/g, '", "') + '"]').concat(toAdd).filter(e => {
			const eInCache = cache.includes(e);
			if (!eInCache) cache.push(e);
			return !eInCache;
		});
	};

(() => {
	"use strict";

	class Enregex extends RegExp {
		constructor(pattern, flags) {
			if (pattern instanceof Array) pattern = pattern.join("|");
			super(pattern, flags);
		}

		static build(src, flags) {
			if (typeof flags != "string" && !Array.isArray(flags)) flags = [];

			const rx = ['', '', ''];

			if (/(?:^|; )startsWith: ?((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: or (?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/.test(src)) rx[0] = `^(?:${src.match(/(?:^|; )startsWith: ?((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: or (?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/)[1].split(/ or /).join("|").replace(/(?<!\\)\(|(?<!\\)\)/g, '')})`;
			if (/(?:^|; )endsWith: ?((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: or (?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/.test(src)) rx[2] = `(?:${src.match(/(?:^|; )endsWith: ?((?:[^\s()]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\))(?: or (?:[^\s(]+|\((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*\)))*)/)[1].split(/ or /).join("|").replace(/(?<!\\)\(|(?<!\\)\)/g, '')})$`;
			if (/(?:^|; )(?:src|source): ?[^]+/.test(src)) rx[1] = src.match(/(?<=(?:^|; ?)(?:src|source) ?:)[^]+/)[0].trimStart().replace(/ or /g, "|");

			let groups = rx[1].match(/group<[a-zA-Z\d]+>\([^]*\)/g);
			rx[1] = rx[1].replace(/group<[a-zA-Z\d]+>\(([^]*)\)/g, "($1)");
			groups = groups && [...new Set(groups)];
			const groupsValues = {};

			for (const i in groups) {
				const [groupName, groupValue] = groups[i].match(/group<([a-zA-Z\d]+)>\(([^()]*)\)/).slice(1);
				if (groupValue.startsWith("?")) throw new EnregexError(`invalid regex inside of the group ${i + 1}`);
				groupsValues[groupName] = groupValue;
				rx[1].replace(groups[i], `(${groupValue})`);
			}

			rx[1] = rx[1].replace(/;? *not-before *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*)\)/g, "(?<!$1)")
				.replace(/;? *not-after *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*)\)/g, "(?!$1)")
				.replace(/(?<!(?<!\\)\\(?:\\\\)*)<([a-zA-Z\d]+)>/g, (_, ...a) => groupsValues[a[0]])
				.replace(/;? *repeat: *\(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*) *, *(((?:[^()\\]+|(?<!(?<!\\)\\(?:\\\\)*)\\\)|(?<!(?<!\\)\\(?:\\\\)*)\\\()*))\)/g, "$1{$2}");

			return new Enregex(rx.join(''), (typeof flags == "string" ? flags.split('') : flags).reduce((a, b) => a + (a.includes(b) || !"gimusy".includes(b) ? '' : b), ''));
		}

		get array() {
			return arrayGetterFn(this);
		}

		includes(toFind) {
			if (typeof toFind != "string" && !Array.isArray(toFind)) throw new EnregexError("'toFind' must be a string or instance of Array");
			return typeof toFind == "string" ? this.test(toFind) : toFind.map(e => this.test(e)).reduce((a, b) => a && b);
		}

		merge(...rxs) {
			if (!Array.isArray(rxs) || !rxs.length) throw new EnregexError("'regexs' must includes at at least on regex");
			if (Array.isArray(rxs[0])) rxs = rxs[0];
			const lim = rxs.length;
			for (let i = 0; i < lim; i++) {
				if (typeof rxs[i] == "string") rxs[i] = new Enregex(rxs[i]);
				if (!(rxs[i] instanceof RegExp)) throw new EnregexError("'regexs' must includes only strings and regexs");
			}

			return new Enregex(rxs.concat(this).reduce((a, b) => {
				const srcA = (typeof a == "string" ? a : a.source).match(/(?<!(?<!\\)\\(?:\\\\)*)\([^]+\)\??|./g),
					srcB = b.source.match(/(?<!(?<!\\)\\(?:\\\\)*)\([^]+\)\??|./g),
					res = [];

				for (let i = 0; i < Math.max(srcA.length, srcB.length); i++) {
					const currSrcA = srcA[i],
						currSrcB = srcB[i];

					if (currSrcA == currSrcB) res.push(currSrcA);
					else if (!currSrcB) res.push(currSrcA);
					else if (!currSrcA) res.push(currSrcB);
					else if (currSrcA == ".") {
						if (currSrcB == "." || currSrcB == "[" && srcB[i + 1] == "^" && srcB[i + 2] == "]") {
							res.push(".");
							if (currSrcB == "[" && srcB[i + 1] == "^" && srcB[i + 2] == "]") srcB.splice(i, 2);
						} else if (!(currSrcB == "\\" && srcB[i + 1] == "n")) res.push(currSrcB);
					} else if (currSrcB == ".") {
						if (!(currSrcA == "\\" && srcA[i + 1] == "n")) res.push(currSrcA);
						else if (currSrcA == "." || currSrcA == "[" && srcA[i + 1] == "^" && srcA[i + 2] == "]") {
							res.push(".");
							if (currSrcA == "[" && srcA[i + 1] == "^" && srcA[i + 2] == "]") srcA.splice(i, 2);
						}
					} else if (currSrcA == "[" && srcA[i + 1] == "^" && srcA[i + 2] == "]") {
						srcA.splice(i, 2);
						if (currSrcB == "[" && srcB[i + 1] == "^" && srcB[i + 2] == "]") {
							srcB.splice(i, 2);
							res.push("[^]");
						} else if (currSrcB == ".") res.push(".");
					} else if (currSrcB == "[" && srcB[i + 1] == "^" && srcB[i + 2] == "]") {
						srcB.splice(i, 2);
						if (currSrcA == "[" && srcA[i + 1] == "^" && srcA[i + 2] == "]") {
							srcA.splice(i, 2);
							res.push("[^]");
						} else if (currSrcA == ".") res.push(".");
					} else if (currSrcA == "?") {
						res.push(srcA.splice(i, 1));
						i--;
					} else if (currSrcB == "?") {
						res.push(srcB.splice(i, 1));
						i--;
					} else if (currSrcA == srcB[i + 1]) {
						res.push(currSrcB + "?");
						srcB.splice(i, 1);
						i--;
					} else if (currSrcB == srcA[i + 1]) {
						res.push(currSrcA + "?");
						srcA.splice(i, 1);
						i--;
					} else res.push(`(?:${currSrcA}|${currSrcB})`);
				}

				return res.join('');
			}, /./));
		}

		split() {
			return this.source.split(/(?<!\([^()]+)\|/).map(e => new Enregex(e, this.flags));
		}
	}

	module.exports = Enregex;
})();
