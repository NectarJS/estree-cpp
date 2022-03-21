export function Literal(leaf) {
	if (typeof leaf.value === 'string') {
		return leaf.raw || `"${leaf.value.replace(/\\/g, '\\\\').replace(/\"/g, '\\\"')}"`
	}
	if (leaf.value === null) {
		return `NectarCore::Global::${leaf.value}`
	}
	return leaf.raw !== undefined ? leaf.raw : String(leaf.value)
}
