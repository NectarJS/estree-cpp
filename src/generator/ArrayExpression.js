export function ArrayExpression (leaf, toString) {
	if (!leaf.elements.length) return `new NectarCore::Class::Array()`
	return `new NectarCore::Class::Array(NectarCore::Type::vector_t({${
		toString({
			type: 'SequenceExpression',
			expressions: leaf.elements
		})
	}}))`
}
