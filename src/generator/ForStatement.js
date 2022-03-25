const empty = { type: 'EmptyStatement' }

export function ForStatement (leaf, toString) {
  let str = 'for ('
  str += toString(leaf.init ?? empty) + ';'
  str += toString(leaf.test ?? empty) + ';'
  if (leaf.update) str += toString(leaf.update)
  str += ') '
  str += toString(leaf.body)
  return str
}

export function ForInStatement (leaf, toString) {
  return `for (${toString(leaf.left)} : ${toString(leaf.right)}) ` + toString(leaf.body)
}
