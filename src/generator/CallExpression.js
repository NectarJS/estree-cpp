export function CallExpression (leaf, toString) {
  return `${toString(leaf.callee)}(${
    toString({
      type: 'SequenceExpression',
      expressions: leaf.arguments ?? []
    })
  })`
}

export function NewExpression (leaf, toString) {
  return `NectarCore::Operator::New(${toString(leaf.callee)})(${
    toString({
      type: 'SequenceExpression',
      expressions: leaf.arguments ?? []
    })
  })`
}
