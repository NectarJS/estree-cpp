const { Node } = require('./_classes')

const globals = [/*
	// This
	'globalThis',
	// Timers
	'setImmediate', 'setTimeout', 'setInterval',
	'clearImmediate', 'clearTimeout', 'clearInterval',
	'queueMicrotask', 'performance',
	// APIs
	'console', 'Date', 'JSON', 'Math',
	// Objects
	'Array', 'Boolean', 'BigInt', 'Symbol', 'Number', 'Object',
	'Error', 'RegExp',
*/]

class Program extends Node {
	getHeader (s) {
		let str = ''
		for (const variable of s.globalsUsed) {
			if (!globals.includes(variable)) {
				// console.warn(`// Unexpected global ${variable}`)
				continue
			}
			// str += `${s.Var} ${variable};\n`
			str += `auto &${variable} = ${s.GlobalNamespace}${variable};\n`
		}
		return str
	}

	constructor (options) {
		super(options)
		this.sourceType = options.sourceType
		this.body = options.body
	}
	toString (s) {
		const body = this.body.map(v => {
			const res = v.toString(s)
			return res + (res.endsWith('}') ? '' : ';')
		}).join('\n')
		return this.getHeader(s) + body
	}
}

module.exports = { Program }
