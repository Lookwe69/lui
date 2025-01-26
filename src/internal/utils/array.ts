/**
 * Checks if two arrays are shallowly equal.
 */
export function shallowArrayEquals(a: ReadonlyArray<unknown>, b: ReadonlyArray<unknown>) {
	return a === b || (a.length === b.length && a.every((v, i) => v === b[i]));
}
