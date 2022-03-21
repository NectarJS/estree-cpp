const nativeOperators = [
	"=", "+=", "-=", "*=", "/=", "%=", "&=", "|=", "^=", "<<=", ">>="
]

export function AssignmentExpression (leaf) {
	if (!nativeOperators.includes(leaf.operator)) {
		leaf.right = {
			type: "BinaryExpression",
			left: leaf.left,
			operator: leaf.operator.replace("=", ""),
			right: leaf.right
		}
		leaf.operator = "="
	}
}
