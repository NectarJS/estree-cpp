export function WithStatement (leaf) {
	leaf.type = "BlockStatement"
	leaf.body = [
		{
			type: "ExpressionStatement",
			directive: `_ffi_using (${toString(leaf.object)})`
		},
		...(
			leaf.body.type === "BlockStatement"
			? leaf.body.body
			: [leaf.body]
		)
	]
}
