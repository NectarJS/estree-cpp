export function SwitchCase (leaf, toString) {
  return (this.test ? `case (${toString(leaf.test)}):` : 'default:') +
    toString(leaf.consequent)
}

export function SwitchStatement (leaf, toString) {
  return `switch (${toString(leaf.discriminant)}) ` +
    this.cases.map(toString).join('\n')
}
