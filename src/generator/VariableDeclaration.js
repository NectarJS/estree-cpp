export function VariableDeclarator (leaf, toString) {
  if (leaf.init) {
    return `${toString(leaf.id)}=${toString(leaf.init)}`
  }
  return toString(leaf.id)
}

export function VariableDeclaration (leaf, toString) {
  return (leaf.kind === 'const' ? 'const auto ' : 'auto ') +
    leaf.declarations.map(toString).join() + ';'
}
