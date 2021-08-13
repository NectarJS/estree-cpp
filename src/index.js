const Meta = require('./meta')
const Statements = require('./statements')
const Expressions = require('./expressions')

module.exports = Object.assign({}, Meta, Expressions, Statements)