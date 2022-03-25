export function WhileStatement (leaf, toString) {
  return `while(${toString(leaf.test)})${toString(leaf.body)}`
}

export function DoWhileStatement (leaf, toString) {
  return `do ${toString(leaf.body)} while(${toString(leaf.test)})`
}
