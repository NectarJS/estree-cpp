export function MemberExpression (leaf, toString) {
  let str = `(NectarCore::VAR)(${toString(leaf.object)})`
  str += leaf.optional ? '.optionalAccessor(' : '['
  str += leaf.computed
    ? toString(leaf.property)
    : `"${leaf.property.name}"`
  str += leaf.optional ? ')' : ']'
  return str
}
