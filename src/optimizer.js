import { simple as walk } from "acorn-walk"
import * as Optimizer from "./optimizer/index.js"

export default function OptimizeAST (tree) {
	walk(tree, Optimizer)
}
