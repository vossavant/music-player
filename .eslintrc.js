// {
//   "plugins": ["@vue"],
//   "rules": {
//     "no-tabs": 0,
//     "indent": [2, "tab"]
//   }
// }
module.exports = {
	extends: [
		// add more generic rulesets here, such as:
		// 'eslint:recommended',
		// 'plugin:vue/vue3-recommended'
		"plugin:vue/essential"
	],
	rules: {
		// override/add rules settings here, such as:
		// 'vue/no-unused-vars': 'error'
		"no-tabs": 0,
		"indent": [2, "tab"],
		"vue/html-indent": [2, "tab"]
	}
}