export function YieldExpression (leaf) {
  if (leaf.delegate) {
    throw new Error('yield* not supported')
  }
}
