const { Node } = require('./_classes')

class Program extends Node {
	constructor (options) {
		super(options)
		this.sourceType = options.sourceType
		this.body = options.body
	}
	toString () { return this.body.join('\n') }
}

module.exports = { Program }
