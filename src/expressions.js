const { Node } = require('./_classes')

class Expression extends Node {
	constructor (options) {
		super(options)
		if (options.optional) {
			throw new Error('Optional chaining not implemented')
		}
	}
}

const GlobalIdentifier = ['undefined', 'null', 'Infinity', 'NaN']
class Identifier extends Expression {
	constructor (options) {
		super(options)
		this.name = options.name
		if (GlobalIdentifier.indexOf(this.name) !== -1) {
			this.name = `NectarCore::Global::${this.name}`
		}
	}
	toString () { return this.name }
}

class Literal extends Expression {
	constructor (options) {
		super(options)
		this.raw = options.raw
		this.value = options.value
		this.regex = options.regex
		if (!this.raw) {
			if (this.value === null) {
				this.raw = 'null'
			}
			else if (typeof this.value === 'string') {
				this.raw = `"${this.value.replace(/\\/g, '\\\\').replace(/"/g, '\\\"')}"`
			}
		}
		if (GlobalIdentifier.indexOf(this.raw) !== -1) {
			this.raw = `NectarCore::Global::${this.raw}`
		}
		if (this.regex) {
			throw new Error('RegExp not implemented')
		}
	}
	toString () {
		if (this.raw) return this.raw
		return String(this.value)
	}
}
class RegExpLiteral extends Literal {}

class ThisExpression extends Expression {
	toString () { return '(*this)' }
}

class ArrayExpression extends Expression {
	constructor (options) {
		super(options)
		this.elements = options.elements
	}
	toString () { return `NectarCore::Class::Array((NectarCore::Type::vector_t){${this.elements.join(', ')}})` }
}

class ObjectExpression extends Expression {
	constructor (options) {
		super(options)
		this.properties = options.properties
	}
	toString () { return `NectarCore::Class::Object((NectarCore::Type::object_t){${this.properties.join(', ')}})` }
}

class Property extends Node {
	constructor (options) {
		super(options)
		this.key = options.key
		this.value = options.value
		// this.kind = String(options.king)
		if (options.kind !== "init") {
			throw new Error('Propetry getter/setter not implemented')
		}
	}
	toString () { return `(NectarCore::Type::pair_t)({${this.key}, ${this.value})` }
}

class UnaryExpression extends Expression {
	constructor (options) {
		super(options)
		this.operator = options.operator
		this.prefix = options.prefix
		this.argument = options.argument
	}
    toString () {
		return this.prefix
			? `${this.operator}${this.argument}`
			: `${this.argument}${this.operator}`
	}
}
class UpdateExpression extends UnaryExpression {}

const BinaryOperator = [
	"==", "!=", "<", "<=", ">", ">=", "&&", "||",
	"<<", ">>", "+", "-", "*", "/", "%", "|", "^", "&"
]
const AssignmentOperator = ["=", "+=", "-=", "*=", "/=", "%=", "<<=", ">>=", "|=", "^=", "&="]

class BinaryExpression extends Expression {
	constructor (options) {
		super(options)
		this.operator = options.operator
		this.left = options.left
		this.right = options.right
		if (this.operator.length === 3 && this.operator.indexOf('==') !== -1) {
			const inverse = this.operator.indexOf('!') !== -1
			this.operator = `<NectarCore::Operator::Strict${inverse ? 'Not' : ''}Equal>`
		} else if (
			BinaryOperator.indexOf(this.operator) === -1
			&& AssignmentOperator.indexOf(this.operator) === -1
		) {
			throw new Error(`Operator ${this.operator} not implemented`)
		}
	}
    toString () { return `${this.left} ${this.operator} ${this.right}` }
}
class LogicalExpression extends BinaryExpression {}

class AssignmentExpression extends BinaryExpression {
	constructor (options) {
		super(options)
		if (AssignmentOperator.indexOf(this.operator) === -1) {
			const operator = this.operator.slice(0, -1)
			this.operator = '='
			this.right = new BinaryExpression({
				type: 'BinaryExpression',
				operator,
				left: this.left,
				right: this.right
			})
		}
	}
}

class StaticPattern extends Expression {
	constructor (options) {
		super(options)
		for (const name of this.fields) {
			this[name] = options[name]
		}
	}
}

class MemberExpression extends StaticPattern {
	get fields () { return ['computed', 'property', 'object'] }
	toString () {
		return this.computed
			? `${this.object}[${this.property}]`
			: `${this.object}["${this.property}"]`
	}
}

class ConditionalExpression extends StaticPattern {
	get fields () { return ['test', 'consequent', 'alternate'] }
	toString () { return `${this.test} ? ${this.consequent} : ${this.alternate}` }
}

class CallExpression extends StaticPattern {
	get fields () { return ['callee', 'arguments'] }
	toString () { return `${this.callee}(${this.arguments.join(', ')})` }
}

class NewExpression extends CallExpression {
	toString () { return `new ${super.toString()}` }
}

class SequenceExpression extends Expression {
	constructor (options) {
		super(options)
		this.expressions = options.expressions
	}
	toString () { return this.expressions.join(', ') }
}

module.exports = {
	Identifier,
	Literal,
	RegExpLiteral,
	ThisExpression,
	ArrayExpression,
	ObjectExpression,
	Property,
	UnaryExpression,
	UpdateExpression,
	BinaryExpression,
	AssignmentExpression,
	LogicalExpression,
	MemberExpression,
	ConditionalExpression,
	CallExpression,
	NewExpression,
	SequenceExpression,
}
