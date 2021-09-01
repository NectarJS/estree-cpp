const { Node } = require('./_classes')

const GlobalIdentifier = ['undefined', 'null', 'Infinity', 'NaN']
class Identifier extends Node {
	constructor (options) {
		super(options)
		this.name = options.name.replace(/[^\x00-\x7F]|\$/g, v => {
			const charCode = v.charCodeAt().toString(16)
			return charCode.length > 4
				? `\\U${v.padStart(8, 0)}`
				: `\\u${v.padStart(4, 0)}`
		})
	}
	toString (s) {
		if (GlobalIdentifier.indexOf(this.name) !== -1) {
			return `${s.GlobalNamespace}${this.name}`
		}
		s.use(this.name)
		return this.name
	}
}

class Literal extends Node {
	constructor (options) {
		super(options)
		this.raw = options.raw
		this.value = options.value
		this.regex = options.regex
		if (this.regex) {
			throw new Error('RegExp not implemented')
		}
	}
	toString (s) {
		if (typeof this.value === 'string') {
			return this.raw || `"${this.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"')}"`
		}
		const raw = this.raw !== undefined ? this.raw : String(this.value)
		return GlobalIdentifier.indexOf(raw) !== -1
			? `${s.GlobalNamespace}${raw}`
			: this.raw
	}
}
class RegExpLiteral extends Literal {}

class ThisExpression extends Node {
	get ThisLiteral () { return '__Nectar_THIS' }
	toString (s) {
		s.use(this.ThisLiteral)
		return this.ThisLiteral
	}
}

class ArrayExpression extends Node {
	constructor (options) {
		super(options)
		this.elements = options.elements
	}
	toString (s) {
		if (!this.elements || !this.elements.length) return `${s.ClassNamespace}Array()`
		const elems = this.elements.map(v => v.toString(s)).join()
		return `${s.ClassNamespace}Array((${s.ClassNamespace}vector_t){${elems}})`
	}
}

class ObjectExpression extends Node {
	constructor (options) {
		super(options)
		this.properties = options.properties
	}
	toString (s) {
		if (!this.properties || !this.properties.length) return `${s.ClassNamespace}Object()`
		const props = this.properties.map(v => v.toString(s)).join()
		return `${s.ClassNamespace}Object((${s.ClassNamespace}object_t){${props}})`
	}
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
	toString (s) {
		return `(${s.Namespace}Type::pair_t)({${this.key.toString(s)},${this.value.toString(s)})`
	}
}

class UnaryExpression extends Node {
	constructor (options) {
		super(options)
		this.operator = options.operator
		this.prefix = options.prefix
		this.argument = options.argument
	}
    toString (s) {
		return this.prefix
			? `${this.operator.toString(s)}${this.argument.toString(s)}`
			: `${this.argument.toString(s)}${this.operator.toString(s)}`
	}
}

const ComparisonOperators = ["==", "!=", "<", "<=", ">", ">="]
const MathOperators = ["&&", "||", "+", "-", "*", "/", "%", "<<", ">>", "|", "^", "&"]
const NativeOperators = ["=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="]
const AllowedOperators = [ ...NativeOperators, ...MathOperators, ...ComparisonOperators ]
const FunctionOperators = {
	"===": "StrictEqual",
	"!==": "StringNotEqual",
	"instanceof": "InstanceOf",
	"in": "InObject",
	">>>": "UnsignedRightShift",
	"??": "NullishCoalescing",
}

class BinaryExpression extends Node {
	constructor (options) {
		super(options)
		this.operator = options.operator
		this.left = options.left
		this.right = options.right
	}
    toString (s) {
		if (FunctionOperators[this.operator]) {
			return `${s.Namespace}::Operator::${FunctionOperators[this.operator]}(${this.left.toString(s)}, ${this.right.toString(s)})`
		}
		if (!AllowedOperators.includes(this.operator)) {
			throw new Error(`Operator ${this.operator} not implemented`)
		}
		return `${this.left.toString(s)} ${this.operator.toString(s)} ${this.right.toString(s)}`
	}
}

class AssignmentExpression extends BinaryExpression {
	constructor (options) {
		super(options)
		if (this.operator.endsWith('=') && !NativeOperators.includes(this.operator)) {
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

class StaticPattern extends Node {
	constructor (options) {
		super(options)
		for (const name of this.fields) {
			this[name] = options[name]
		}
	}
}

class MemberExpression extends StaticPattern {
	get fields () { return ['computed', 'property', 'object', 'optional'] }
	toString (s) {
		const object = this.object.toString(s)
		const property = this.computed
			? this.property.toString(s)
			: `"${this.property.name}"`
		const objectStr = this.object.type === 'Literal'
			? `(${s.Var})(${object})`
			: object
		return this.optional 
			?`${objectStr}.optionalMember(${property})`
			: `${objectStr}[${property}]`
	}
}

class ConditionalExpression extends StaticPattern {
	get fields () { return ['test', 'consequent', 'alternate'] }
	toString (s) {
		return `(bool)(${this.test.toString(s)})`
			+ `?(${this.consequent.toString(s)}):(${this.alternate.toString(s)})`
	}
}

class CallExpression extends StaticPattern {
	get fields () { return ['callee', 'arguments'] }
	toString (s) {
		return this.callee.toString(s) + `(${this.arguments.map(v => v.toString(s)).join()})`
	}
}

class NewExpression extends CallExpression {
	toString (s) { return `new ${super.toString(s)}` }
}

class SequenceExpression extends Node {
	constructor (options) {
		super(options)
		this.expressions = options.expressions
	}
	toString (s) { return this.expressions.map(v => v.toString(s)).join() }
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
	BinaryExpression,
	AssignmentExpression,
	MemberExpression,
	ConditionalExpression,
	CallExpression,
	NewExpression,
	SequenceExpression,
}
