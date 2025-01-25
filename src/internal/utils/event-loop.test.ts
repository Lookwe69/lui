import { expect } from '@open-wc/testing';

import { nextMacrotask, nextMicrotask } from './event-loop';

describe('eventLoop', () => {
	it('nextMicrotask', async () => {
		// Arrange
		const arr = [];

		// Act
		queueMicrotask(() => arr.push(0));
		nextMicrotask()
			.then(() => arr.push(1))
			.then(() => arr.push(2));
		nextMicrotask().then(() => arr.push(3));
		queueMicrotask(() => arr.push(4));
		arr.push(5);
		nextMicrotask().then(() => arr.push(6));

		// Assert
		await nextMacrotask();
		expect(arr).deep.equal([5, 0, 1, 3, 4, 6, 2]);
	});

	it('nextMacrotask', async () => {
		// Arrange
		const arr = [];

		// Act
		nextMicrotask()
			.then(() => arr.push(0))
			.then(() => arr.push(1));
		nextMacrotask().then(() => arr.push(2));
		nextMicrotask()
			.then(() => arr.push(3))
			.then(() => arr.push(4));
		arr.push(5);
		nextMacrotask().then(() => arr.push(6));

		// Assert
		await nextMacrotask();
		expect(arr).deep.equal([5, 0, 3, 1, 4, 2, 6]);
	});
});
