class Node {
	constructor ({ type, loc = null }) {
		this.type = type
		this.loc = loc && new SourceLocation(loc)
	}
	toString () { return '' }
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
	toString () {
		const args = '[&](NectarCore::VAR __Nectar_THIS, NectarCore::VAR* __Nectar_VARARGS, int __Nectar_VARLENGTH)'
		let str = 'NectarCore::VAR arguments = NectarCore::Class::Array(__Nectar_VARARGS, __Nectar_VARARGS + __Nectar_VARLENGTH);\n'
		for (let i = 0; i < this.params.length; i++) {
			str += `NectarCore::VAR ${this.params[i]};\n`
			str += `if (__Nectar_VARLENGTH > ${i}) ${this.params[i]} = __Nectar_VARARGS[${i}];\n`
		}
		const body = this.body.toString()
		const fn = `${args} {\n${str}` + (body.indexOf('{') === 0 ? body.slice(1) : `${body}}`)
		return (this.id ? `NectarCore::VAR ${this.id} = ` : '')
			+ `NectarCore::Class::Function(${fn})`
	}
}

module.exports = { Node, SourceLocation, Position, Function }
