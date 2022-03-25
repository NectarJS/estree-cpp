export function AwaitExpression (leaf, toString) {
  return 'co_await ' + toString(leaf.argument ?? {
    type: 'Identifier',
    name: 'undefined'
  })
}
