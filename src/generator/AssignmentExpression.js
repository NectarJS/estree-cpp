export function AssignmentExpression (leaf, toString) {
	let str = ""
	str += toString(leaf.left)
	str += ` ${leaf.operator} `
	str += toString(leaf.right)
	return str
}