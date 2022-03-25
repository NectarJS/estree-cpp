import { FunctionExpression } from './FunctionExpression.js'

export function FunctionDeclaration (leaf) {
  FunctionExpression(leaf)
  leaf.declarations = [
    {
      type: 'VariableDeclarator',
      id: leaf.id,
      init: {
        ...leaf,
        type: 'FunctionExpression'
      }
    }
  ]
  leaf.type = 'VariableDeclaration'
  leaf.kind = 'let'
}
