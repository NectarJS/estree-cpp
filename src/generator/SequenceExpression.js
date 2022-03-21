export function SequenceExpression (leaf, toString) {
	return leaf.expressions.map(toString).join()
}
