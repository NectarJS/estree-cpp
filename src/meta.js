const { Node, Stack } = require('./_classes')

const globals = [
	'__Nectar_THIS', 'globalThis',
	'setImmediate', 'setTimeout', 'setInterval',
	'window', 'console'
]

class Program extends Node {
	getHeader (s) {
		let str = ''
		for (const variable of s.globalsUsed) {
			if (!globals.includes(variable)) {
				console.warn(`Unexpected global ${variable}`)
				continue
			}
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
		const body = this.body.map(v => v.toString(s)).join('\n')
		return this.getHeader(s) + body
	}
}

module.exports = { Program }