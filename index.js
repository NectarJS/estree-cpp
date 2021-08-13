const Acorn = require('acorn')
const Types = require('./src/index')
const { Stack } = require('./src/_classes')

function walkAST (ast) {
	if (typeof ast !== 'object' || ast === null) return ast
	for (const key in ast) {
		ast[key] = walkAST(ast[key])
	}
	if (ast.type) {
		if (!Types[ast.type]) throw new Error(`Type ${ast.type} not defined`)
		ast = new Types[ast.type](ast)
	}
	return ast
}

function transpile (code, options = {}) {
	const stack = new Stack(options.stack ?? {})
	const ast = Acorn.parse(code, options.parser ?? { ecmaVersion: 2020 })
	const classes = walkAST(ast)
	return classes.toString(stack)
}

module.exports = transpile
