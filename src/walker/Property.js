export function Property (leaf) {
	if (leaf.kind !== "init") {
		throw new Error('Propetry getter/setter not implemented')
	}
}
