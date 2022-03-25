const GlobalIdentifier = ['undefined', 'Infinity', 'NaN']
export function Identifier (leaf) {
  if (leaf.name.startsWith('__Nectar_')) {
    throw new Error(`Forbidden identifier ${leaf.name}`)
  }
  if (GlobalIdentifier.indexOf(leaf.name) > -1) {
    return `NectarCore::Global::${leaf.name}`
  }
  return leaf.name.replace(/[^\x20-\x7F]|\$/g, v => {
    const charCode = v.charCodeAt().toString(16)
    return charCode.length > 4
      ? `\\U${v.padStart(8, 0)}`
      : `\\u${v.padStart(4, 0)}`
  })
}
