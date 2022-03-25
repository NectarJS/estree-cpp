export function ThrowStatement (leaf, toString) {
  return 'throw ' + toString(leaf.argument ?? {
    type: 'Identifier',
    name: 'undefined'
  })
}
