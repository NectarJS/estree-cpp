export function BreakStatement (leaf) {
	if (leaf.label) {
		throw new Error("Break must not have label")
	}
}
