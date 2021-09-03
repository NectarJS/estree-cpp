const { strictEqual } = require('assert')

class Node {
	constructor ({ type, loc = null }) {
		this.type = type
		this.loc = loc && new SourceLocation(loc)
	}
	toString () { return '' }
}

class Stack {
	constructor ({
		namespace = 'NectarCore::',
		globalNamespace = `${namespace}Global::`,
		classNamespace = `${namespace}Class::`
	} = {}) {
		this.Namespace = namespace
		this.GlobalNamespace = globalNamespace
		this.ClassNamespace = classNamespace
		this.Var = namespace + 'VAR'
		this.globalsUsed = new Set()
		this.literalsUsed = new Set()
		this.variableStack = new Map()
	}
	useGlobal (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		this.globalsUsed.add(name)
	}
	useLiteral (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		this.literalsUsed.add(name)
	}
	addVariable (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		const stack = this.variableStack.get(name) || []
		stack.push(0)
		if (!this.variableStack.has(name)) this.variableStack.set(name, stack)
	}
	useVariable (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		const stack = this.variableStack.get(name)
		stack[stack.length - 1]++
	}
	removeVariable (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		if (!this.variableStack.has(name)) return null
		return this.variableStack.get(name).pop()
	}
	use (name) {
		strictEqual(typeof name, 'string', 'Variable name is not a string')
		if (this.variableStack.has(name)) return this.useVariable(name)
		if (this.literalsUsed.has(name)) return
		this.useGlobal(name)
	}

	blockToString (statements, force = false) {
		if (statements.length === 1 && !force) {
			return `${statements[0].toString(this)};\n`
		}
		statements = statements
			.map(v => v.toString(this))
			.filter(String)
			.map(v => v.split('\n').map(v => '\t' + v).join('\n'))
			.map(v => (v.endsWith('}') || (v += ';'), v + '\n'))
			.join('')
		return `{\n${statements}}`
	}

	parametersToString (args, skip = false) {
		args = args
			.map(v => v.toString(this))
			.filter(String)
			.join()
		return skip ? args : `(${args})`
	}
}

class SourceLocation {
	constructor ({ source = null, start, end }) {
		this.source = source
		this.start = new Position(start)
		this.end = new Position(end)
	}
	toString () { return `${this.start}-${this.end}` }
}

class Position {
    constructor ({ line, column }) {
		this.line = line | 0
		this.column = column | 0
	}
	toString () { return `L${this.line}C${this.column}` }
}

class Function extends Node {
	constructor (options) {
		super(options)
		this.id = options.id
		this.params = options.params
		this.expression = options.expression
		this.body = options.body
		this.async = options.async
		this.generator = options.generator
		if (this.async) {
			throw new Error('Async functions not implemented')
		}
		if (this.generator) {
			throw new Error('Generator functions not implemented')
		}
	}
	toString (s) {
		s.addVariable('arguments')
		for (const { name } of this.params) {
			s.addVariable(name)
		}
		const body = this.body.toString(s)
		let args = ''
		for (let i = 0; i < this.params.length; i++) {
			const { name } = this.params[i]
			if (!s.removeVariable(name)) continue
			args += `${s.Var} ${name};\n`
			args += `if (__Nectar_VARLENGTH > ${i}) ${name} = __Nectar_VARARGS[${i}];\n`
		}
		if (s.removeVariable('arguments')) {
			args += `${s.Var} arguments = ${s.ClassNamespace}Array(__Nectar_VARARGS, __Nectar_VARARGS + __Nectar_VARLENGTH);\n`
		}
		const fn = `${args}${this.expression ? `return ${body};` : body.slice(1, -1)}`
		return (this.id ? `${s.Var} ${this.id.toString(s)} = ` : '')
			+ `${s.Var}(new ${s.ClassNamespace}Function(new ${s.Namespace}Type::function_t([&](${s.Var}& __Nectar_THIS, ${s.Var}* __Nectar_VARARGS, int __Nectar_VARLENGTH) {\n${fn}})))`
	}
}

module.exports = { Node, Stack, SourceLocation, Position, Function }
