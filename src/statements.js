const { Node, Function } = require('./_classes')

class Statement extends Node {}

class ExpressionStatement extends Statement {
	constructor (options) {
		super(options)
		this.expression = options.expression
		// this.directive = options.directive
	}
	toString (s) { return `${this.expression.toString(s)};` }
}
class Directive extends ExpressionStatement {}

class BlockStatement extends Statement {
	constructor (options) {
		super(options)
		this.body = options.body
	}
	toString (s) { return `{\n${this.body.map(v => v.toString(s)).join("\n")}\n}` }
}
class FunctionBody extends BlockStatement {}

class EmptyStatement extends Statement {
	toString (s) { return ';' }
}
class DebuggerStatement extends EmptyStatement {}

class WithStatement extends BlockStatement {
	constructor (options) {
		super(options)
		this.object = options.object
	}
	toString (s) { return `with (${this.object.toString(s)}) ${super.toString(s)}` }
}

class ReturnStatement extends Statement {
	constructor (options) {
		super(options)
		this.argument = options.argument
	}
	toString (s) {
		if (!this.argument) return `return ${s.GlobalNamespace}undefined;`
		return `return ${this.argument.toString(s)};`
	}
}

class LabeledStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
		this.body = options.body
	}
	toString (s) { return `${this.label}:\n${this.body.toString(s)}` }
}

class BreakStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
	}
	toString (s) { return this.label ? `break ${this.label};` : 'break;' }
}

class ContinueStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
	}
	toString (s) { return this.label ? `continue ${this.label};` : 'continue;' }
}

class IfStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.consequent = options.consequent
		this.alternate = options.alternate
	}
	toString (s) {
		return `if (${this.test.toString(s)}) {\n${this.consequent.toString(s)}\n}`
			+ (this.alternate ? ` else {\n${this.alternate.toString(s)}\n}` : '')
	}
}

class SwitchStatement extends Statement {
	constructor (options) {
		super(options)
		this.discriminant = options.discriminant
		this.cases = options.cases
	}
	toString (s) {
		return `switch (${this.discriminant.toString(s)}) {\n`
			+ this.cases.map(v => v.toString(s)).join('\n') + `\n}`
	}
}

class SwitchCase extends Node {
	constructor (options) {
		super(options)
		this.test = options.test
		this.consequent = options.consequent
	}
	toString (s) {
		return (this.test ? `case ${this.test.toString(s)}:` : 'default:')
			+ this.consequent.map(v => v.toString(s)).join('\n')
	}
}

class ThrowStatement extends Statement {
	constructor (options) {
		super(options)
		this.argument = options.argument
	}
	toString (s) { return `throw ${this.argument.toString(s)};` }
}

class TryStatement extends Statement {
	constructor (options) {
		super(options)
		this.block = options.block
		this.handler = options.handler
		this.finalizer = options.finalizer
	}
	toString (s) {
		return `try ${this.block.toString(s)}`
			+ (this.handler ? this.handler.toString(s) : '')
			+ (this.finalizer ? `\nfinally ${this.finalizer.toString(s)}` : '')
	}
}

class CatchClause extends Node {
	constructor (options) {
		super(options)
		this.param = options.param
		this.body = options.body
	}
	toString (s) { return `\ncatch (${this.param.toString(s)}) ${this.body.toString(s)}` }
}

class WhileStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.body = options.body
	}
	toString (s) { return `while (${this.test.toString(s)}) ${this.body.toString(s)}` }
}

class DoWhileStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.body = options.body
	}
	toString (s) { return `do ${this.body.toString(s)}\nwhile (${this.test.toString(s)})` }
}

class ForStatement extends Statement {
	constructor (options) {
		super(options)
		this.init = options.init || new EmptyStatement()
		this.test = options.test || new EmptyStatement()
		this.update = options.update || new EmptyStatement()
		this.body = options.body
	}
	toString (s) {
		return `for (${this.init.toString(s)};${this.test.toString(s)};${this.update.toString(s)}) `
			+ this.body.toString(s)
	}
}

class ForInStatement extends Statement {
	constructor (options) {
		super(options)
		this.left = options.left
		this.right = options.right
		this.body = options.body
	}
	toString (s) {
		return `for (${this.left.toString(s)} : ${this.right.toString(s)}) `
			+ this.body.toString(s)
	}
}

class Declaration extends Statement { }

class FunctionDeclaration extends Function {
	constructor (options) {
		super(options)
		this.id = options.id
		const body = this.body.body || []
		if (!body.length || body[body.length - 1].type !== 'ReturnStatement') {
			body.push(new ReturnStatement({
				type: 'ReturnStatement',
				argument: null
			}))
		}
	}
}

class VariableDeclaration extends Declaration {
	constructor (options) {
		super(options)
		this.declarations = options.declarations
		this.kind = options.kind || "var"
	}
	toString (s) {
		const type = `${s.Namespace}${this.kind === 'const' ? 'CONST' : 'VAR'}`
		return `${type} ${this.declarations.map(v => v.toString(s)).join()};`
	}
}

class VariableDeclarator extends Node {
	constructor (options) {
		super(options)
		this.id = options.id
		this.init = options.init
	}
	toString (s) {
		if (this.id.type === 'Identifier') s.useLiteral(this.id.name)
		return this.id.toString(s) + (this.init ? `=${this.init.toString(s)}` : '')
	}
}

module.exports = {
	ExpressionStatement,
	Directive,
	BlockStatement,
	FunctionBody,
	EmptyStatement,
	DebuggerStatement,
	WithStatement,
	ReturnStatement,
	LabeledStatement,
	BreakStatement,
	ContinueStatement,
	IfStatement,
	SwitchStatement,
	SwitchCase,
	ThrowStatement,
	TryStatement,
	CatchClause,
	WhileStatement,
	DoWhileStatement,
	ForStatement,
	ForInStatement,
	FunctionDeclaration,
	VariableDeclaration,
	VariableDeclarator
}
