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
		this.globalsUsed = new Set()
		this.literalsUsed = new Set()
		this.variableStack = new Map()
	}
	useGlobal (name) { this.globalsUsed.add(name) }
	useLiteral (name) { this.literalsUsed.add(name) }
	addVariable (name) {
		const stack = this.variableStack.get(name) || []
		stack.push(0)
		if (!this.variableStack.has(name)) this.variableStack.set(name, stack)
	}
	useVariable (name) {
		const stack = this.variableStack.get(name)
		stack[stack.length - 1]++
	}
	removeVariable (name) {
		if (!this.variableStack.has(name)) return null
		return this.variableStack.get(name).pop()
	}
	use (name) {
		if (this.variableStack.has(name)) return this.useVariable(name)
		if (this.literalsUsed.has(name)) return
		this.useGlobal(name)
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
		for (const name of this.params) {
			s.addVariable(name)
		}
		const body = this.body.toString(s)
		let args = ''
		for (let i = 0; i < this.params.length; i++) {
			const name = this.params[i]
			if (!s.removeVariable(name)) continue
			args += `NectarCore::VAR ${name};\n`
			args += `if (__Nectar_VARLENGTH > ${i}) ${name} = __Nectar_VARARGS[${i}];\n`
		}
		if (s.removeVariable('arguments')) {
			args += 'NectarCore::VAR arguments = NectarCore::Class::Array(__Nectar_VARARGS, __Nectar_VARARGS + __Nectar_VARLENGTH);\n'
		}
		const fn = '[&](NectarCore::VAR __Nectar_THIS, NectarCore::VAR* __Nectar_VARARGS, int __Nectar_VARLENGTH)'
			+ ` {\n${args}${this.expression ? `return ${body};` : body.slice(1, -1)}`
		return (this.id ? `NectarCore::VAR ${this.id} = ` : '')
			+ `NectarCore::Class::Function(${fn})`
	}
}

module.exports = { Node, Stack, SourceLocation, Position, Function }