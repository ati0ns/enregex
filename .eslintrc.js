module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		"ecmaVersion": 12
	},
	plugins: [
		"@typescript-eslint"
	],
	rules: {
		indent: [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"windows"
		],
		semi: [
			"error",
			"always"
		],
		camelcase: [
			"error",
			{ "properties": "always", "ignoreDestructuring": true, "ignoreGlobals": true }
		],
		"eol-last": "error",
		"func-name-matching": "error",
		"getter-return": "error",
		"global-require": "error",
		"no-undef": "off",
		"key-spacing": "error",
		"lines-between-class-members": "error"
	}
};
