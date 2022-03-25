export function ContinueStatement (leaf) {
  if (leaf.label) {
    throw new Error('Continue must not have label')
  }
}
