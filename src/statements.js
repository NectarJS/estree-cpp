const { Node, Function } = require('./_classes')

class Statement extends Node {}

class ExpressionStatement extends Statement {
	constructor (options) {
		super(options)
		this.expression = options.expression
		// this.directive = options.directive
	}
	toString () { return `${this.expression};` }
}
class Directive extends ExpressionStatement {}

class BlockStatement extends Statement {
	constructor (options) {
		super(options)
		this.body = options.body
	}
	toString () { return `{\n${this.body.join("\n")}\n}` }
}
class FunctionBody extends BlockStatement {}

class EmptyStatement extends Statement {
	toString () { return ';' }
}
class DebuggerStatement extends EmptyStatement {}

class WithStatement extends BlockStatement {
	constructor (options) {
		super(options)
		this.object = options.object
	}
	toString () { return `with (${this.object}) ${super.toString()}` }
}

class ReturnStatement extends Statement {
	constructor (options) {
		super(options)
		this.argument = options.argument
	}
	toString () { return `return ${this.argument || 'NectarCore::Global::undefined'};` }
}

class LabeledStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
		this.body = options.body
	}
	toString () { return `${this.label}:\n${this.body}` }
}

class BreakStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
	}
	toString () { return this.label ? `break ${this.label};` : 'break;' }
}

class ContinueStatement extends Statement {
	constructor (options) {
		super(options)
		this.label = options.label
	}
	toString () { return this.label ? `continue ${this.label};` : 'continue;' }
}

class IfStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.consequent = options.consequent
		this.alternate = options.alternate
	}
	toString () {
		return `if ((bool)(${this.test})) {\n${this.consequent}\n}`
			+ (this.alternate ? ` else {\n${this.alternate}\n}` : '')
	}
}

class SwitchStatement extends Statement {
	constructor (options) {
		super(options)
		this.discriminant = options.discriminant
		this.cases = options.cases
	}
	toString () {
		return `switch (${this.discriminant}) {\n${this.cases.join('\n')}\n}`
	}
}

class SwitchCase extends Node {
	constructor (options) {
		super(options)
		this.test = options.test
		this.consequent = options.consequent
	}
	toString () {
		return (this.test ? `case ${this.test}:` : 'default:')
			+ this.consequen.join('\n')
	}
}

class ThrowStatement extends Statement {
	constructor (options) {
		super(options)
		this.argument = options.argument
	}
	toString () { return `throw ${this.argument};` }
}

class TryStatement extends Statement {
	constructor (options) {
		super(options)
		this.block = options.block
		this.handler = options.handler
		this.finalizer = options.finalizer
	}
	toString () {
		return `try ${this.block}${this.handler || ''}`
			+ (this.finalizer ? `\nfinally ${this.finalizer}` : '')
	}
}

class CatchClause extends Node {
	constructor (options) {
		super(options)
		this.param = options.param
		this.body = options.body
	}
	toString () { return `\ncatch (${this.param}) ${this.body}` }
}

class WhileStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.body = options.body
	}
	toString () { return `while ((bool)${this.test}) ${this.body}` }
}

class DoWhileStatement extends Statement {
	constructor (options) {
		super(options)
		this.test = options.test
		this.body = options.body
	}
	toString () { return `do ${this.body}\nwhile ((bool)${this.test})` }
}

class ForStatement extends Statement {
	constructor (options) {
		super(options)
		this.init = options.init || new EmptyStatement()
		this.test = options.test || new EmptyStatement()
		this.update = options.update || new EmptyStatement()
		this.body = options.body
	}
	toString () { return `for (${this.init} ${this.test} ${this.update}) ${this.body}` }
}

class ForInStatement extends Statement {
	constructor (options) {
		super(options)
		this.left = options.left
		this.right = options.right
		this.body = options.body
	}
	toString () { return `for (${this.left} : ${this.right}) ${this.body}` }
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
	toString () {
		return `NectarCore::${this.kind === 'const' ? 'CONST' : 'VAR'} ${this.declarations.join(', ')};`
	}
}

class VariableDeclarator extends Node {
	constructor (options) {
		super(options)
		this.id = options.id
		this.init = options.init || "NectarCore::Global::undefined"
	}
	toString () { return `${this.id} = ${this.init}` }
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
