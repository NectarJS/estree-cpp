const FunctionUnaryOperators = {
  typeof: 'TypeOf',
  void: 'Void'
}

export function UnaryExpression (leaf, toString) {
  if (FunctionUnaryOperators[leaf.operator]) {
    return `NectarCore::Operator::${FunctionUnaryOperators[leaf.operator]}(${toString(leaf.argument)})`
  }
  return leaf.prefix
    ? leaf.operator + toString(leaf.argument)
    : toString(leaf.argument) + leaf.operator
}
