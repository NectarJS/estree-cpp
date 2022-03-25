import { simple as walk } from 'acorn-walk'
import * as handlers from './walker/index.js'

export default function WalkAST (tree) {
  walk(tree, handlers)
}
