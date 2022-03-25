export function Property (leaf, toString) {
  return `NectarCore::Type::pair_t{(std::string)(${
    toString(leaf.key)
  }),(NectarCore::VAR)(${
    toString(leaf.value)
  })}`
}

export function ObjectExpression (leaf, toString) {
  if (!leaf.properties.length) return 'new NectarCore::Class::Object()'
  return `new NectarCore::Class::Object(NectarCore::Type::object_t{${
    toString({
      type: 'SequenceExpression',
      expressions: leaf.properties
    })
  }})`
}
