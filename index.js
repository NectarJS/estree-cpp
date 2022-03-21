import { parse } from "acorn"
import WalkAST from "./src/walker.js"
import OptimizeAST from "./src/optimizer.js"
import GenerateCode from "./src/generator.js"

export default function Transpile (code, options = {}) {
	const ast = parse(code, {
		ecmaVersion: "latest",
		...(options.parser ?? {})
	})
	try {
		WalkAST(ast)
	} catch (cause) {
		throw new Error('Failed to transpile', { cause })
	}
	try {
		OptimizeAST(ast)
	} catch (cause) {
		console.warn(new Error('Failed to optimize', { cause }))
	}
	try {
		return GenerateCode(ast)
	} catch (cause) {
		throw new Error('Code generation failed', { cause })
	}
}
