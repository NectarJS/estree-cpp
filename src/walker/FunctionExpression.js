export function FunctionExpression (leaf) {
	if (leaf.generator) {
		throw new Error("Generator functions not supported")
	}
	if (leaf.async) {
		throw new Error("Async functions not supported")
	}
	for (const param of leaf.params) {
		if (param.type !== "Identifier" && param.type !== "RestElement") {
			throw new Error("Function param destruct not supported")
		}
	}
	const { body } = leaf.body
	if (!body.length || body[body.length - 1].type !== "ReturnStatement") {
		body.push({
			type: "ReturnStatement",
			argument: null
		})
	}
}
