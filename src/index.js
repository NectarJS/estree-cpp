const Meta = require('./meta')
const Aliases = require('./aliases')
const Statements = require('./statements')
const Expressions = require('./expressions')

const types = Object.assign({}, Meta, Expressions, Statements)
for (const alias in Aliases) {
	types[alias] = types[Aliases[alias]]
}

module.exports = types
