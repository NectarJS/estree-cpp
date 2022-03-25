export function Literal (leaf) {
  if (leaf.regex) {
    throw new Error('RegExp not implemented')
  }
}
