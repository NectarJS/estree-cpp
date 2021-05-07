const { Stack } = require('./src/_classes')

const Meta = require('./src/meta')
const Statements = require('./src/statements')
const Expressions = require('./src/expressions')

const Types = Object.assign({}, Meta, Expressions, Statements)

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

function transpile (ast, { stack } = {}) {
	ast = walkAST(ast)
	return ast.toString(new Stack(stack))
}

module.exports = transpile
