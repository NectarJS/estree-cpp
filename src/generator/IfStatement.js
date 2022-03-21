export function IfStatement (leaf, toString) {
	let str = `if(${toString(leaf.test)})`
	str += toString(leaf.consequent)
	if (leaf.alternate) {
		str += " else "
		str += toString(leaf.alternate)
	}
	return str
}
