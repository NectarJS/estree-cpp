const FunctionBinaryOperators = {
	"===": "StrictEqual",
	"!==": "StringNotEqual",
	"instanceof": "InstanceOf",
	"in": "KeyInObject",
	">>>": "UnsignedRightShift",
	"??": "NullishCoalescing",
}

export function BinaryExpression (leaf, toString) {
	if (FunctionBinaryOperators[leaf.operator]) {
		let str = `NectarCore::Operator::${FunctionBinaryOperators[leaf.operator]}(`
		str += toString({
			type: 'SequenceExpression',
			expressions: [leaf.left, leaf.right]
		})
		str += ")"
		return str
	}
	let str = ""
	str += leaf.left.type === "BinaryExpression"
		? `(${toString(leaf.left)})`
		: toString(leaf.left)
	str += ` ${leaf.operator} `
	str += leaf.right.type === "BinaryExpression"
		? `(${toString(leaf.right)})`
		: toString(leaf.right)
	return str
}
