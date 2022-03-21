import { TemplateElement } from "./TemplateLiteral.js"

export function TaggedTemplateExpression (leaf) {
	leaf.type = "CallExpression"
	leaf.callee = leaf.tag
	leaf.arguments = [
		{
			type: "ArrayExpression",
			elements: leaf.quasi.quasis.map(TemplateElement)
		},
		...leaf.quasi.expressions
	]
}
