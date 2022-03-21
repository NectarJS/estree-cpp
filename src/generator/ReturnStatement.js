export function ReturnStatement (leaf, toString) {
	return (leaf.async ? "co_return " : "return ")
		+ toString(leaf.argument ?? {
			type: "Identifier",
			name: "undefined"
		})
}
