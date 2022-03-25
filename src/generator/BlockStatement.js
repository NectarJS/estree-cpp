export function BlockStatement (leaf, toString) {
  return `{\n${leaf.body.map(toString).join('\n')}\n}`
}
