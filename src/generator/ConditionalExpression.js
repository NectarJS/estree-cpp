export function ConditionalExpression (leaf, toString) {
  return `(bool)(${toString(leaf.test)})` +
    `?(${toString(leaf.consequent)}):(${toString(leaf.alternate)})`
}
