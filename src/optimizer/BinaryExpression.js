function ToPrimitive (leaf) {
	if (leaf.type === 'Identifier') {
		switch (leaf.name) {
			case 'Infinity': return [true, Infinity]
			case 'undefined': return [true, undefined]
			default: return [false]
		}
	}
	if (leaf.type !== 'Literal') return [false]
	return [true, leaf.value]
}

function DoOperator (left, operator, right) {
	switch (operator) {
		case '+': return left + right
		case '-': return left - right
		case '*': return left * right
		case '/': return left / right
		case '**': return left ** right
		case '%': return left % right
		case '>>': return left >> right
		case '<<': return left << right
		case '>>>': return left >>> right
		case '&': return left & right
		case '|': return left | right
		case '^': return left ^ right
		default: throw new Error()
	}
}

export function BinaryExpression (leaf) {
	const [leftPrimitive, leftValue] = ToPrimitive(leaf.left)
	const [rightPrimitive, rightValue] = ToPrimitive(leaf.right)
	if (leftPrimitive && rightPrimitive) {
		try {
			const value = DoOperator(leftValue, leaf.operator, rightValue)
			if (value === undefined || (typeof value === 'number' && !Number.isFinite(value))) {
				leaf.type = 'Identifier'
				leaf.name = String(value)
			} else {
				leaf.type = 'Literal'
				leaf.value = value
			}
		} catch (e) {}
	}
	return leaf
}