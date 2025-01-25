/**
 * Returns a promise that resolves after the next microtask
 *
 * [Info](https://javascript.info/event-loop)
 *
 * @example
 *
 * async function test() {
 * 	// ... before code
 * 	await nextMicrotask();
 * 	// ... code executed after the microtask
 * }
 *
 */
export function nextMicrotask(): Promise<void> {
	return Promise.resolve();
}

/**
 * Returns a promise that resolves after the next macrotask
 *
 * [Info](https://javascript.info/event-loop)
 *
 * Macrotask can be used to await an event to fully bubbled up in a listener.
 *
 * @example
 *
 * async function handleClick(event) {
 * 	// ... before code
 * 	// Wait a full task for event bubbling to complete.
 * 	await nextMacrotask();
 * 	if (event.defaultPrevented) return;
 * 	// ... code executed after the macrotask
 * }
 * element.addEventListener('click', handleClick);
 *
 */
export function nextMacrotask(): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, 0));
}
