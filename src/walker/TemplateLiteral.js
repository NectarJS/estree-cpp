export function TemplateElement (leaf) {
	leaf.type = "Literal"
	leaf.raw = leaf.value.raw
	leaf.value = leaf.value.cooked
}

function* TemplateElementIterator (leaf) {
	for (let i = 0; i < leaf.expressions; i++) {
		yield TemplateElement(leaf.quasis[i])
		yield leaf.expressions[i]
	}
	yield TemplateElement(leaf.quasis[leaf.quasis.length - 1])
}

export function TemplateLiteral (leaf) {
	if (!leaf.expressions.length) {
		TemplateElement(leaf.quasis[0])
		Object.assign(leaf, leaf.quasis[0])
		return
	}
	const iter = TemplateElementIterator(leaf)
	let obj = {
		type: "BinaryExpression",
		left: iter.next().value,
		operator: "+",
		right: iter.next().value
	}
	for (const value of iter) {
		obj = {
			type: obj.type,
			left: obj,
			operator: obj.operator,
			right: value
		}
	}
	Object.assign(leaf, obj)
}
