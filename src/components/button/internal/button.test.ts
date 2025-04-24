import { customElement } from 'lit/decorators.js';

import { nextMacrotask } from '@lookwe/utils/event-loop';
import { elementUpdated, expect, fixture, html } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import sinon from 'sinon';

import { Button } from './button.js';

@customElement('test-button')
class TestButton extends Button {}

describe('Button', () => {
	async function setupTest() {
		const button = await fixture<TestButton>(html`<test-button></test-button>`);
		return { button };
	}

	it('should delegate focus to button', async () => {
		// Arrange
		const { button } = await setupTest();

		// Act
		button.focus();

		// Assert
		expect(document.activeElement).equal(button);
		expect(button.shadowRoot!.activeElement).equal(button.shadowRoot!.querySelector('.button'));
	});

	it('should not be focusable when disabled', async () => {
		// Arrange
		const { button } = await setupTest();
		button.disabled = true;
		await elementUpdated(button);

		// Act
		button.focus();

		// Assert
		expect(document.activeElement).not.equal(button);
	});

	it('should be clickable', async () => {
		// Arrange
		const { button } = await setupTest();
		const clickListener = sinon.fake();
		button.addEventListener('click', clickListener);
		await elementUpdated(button);

		// Act
		button.click();

		// Assert
		expect(clickListener).calledOnceWith(sinon.match.instanceOf(MouseEvent));
	});

	it('should not be clickable when disabled', async () => {
		// Arrange
		const { button } = await setupTest();
		const clickListener = sinon.fake();
		button.disabled = true;
		button.addEventListener('click', clickListener);
		await elementUpdated(button);

		// Act
		button.click();

		// Assert
		expect(clickListener).callCount(0);
	});

	it('press Enter key should trigger click event', async () => {
		// Arrange
		const { button } = await setupTest();
		const clickListener = sinon.fake();
		button.addEventListener('click', clickListener);

		// Act
		button.focus();
		await sendKeys({ press: 'Enter' });

		// Assert
		expect(clickListener).calledOnceWith(sinon.match.instanceOf(MouseEvent));
	});

	it('press Space key should trigger click event', async () => {
		// Arrange
		const { button } = await setupTest();
		const clickListener = sinon.fake();
		button.addEventListener('click', clickListener);

		// Act
		button.focus();
		await sendKeys({ press: 'Space' });

		// Assert
		expect(clickListener).calledOnceWith(sinon.match.instanceOf(MouseEvent));
	});

	describe('form', () => {
		async function setupFormTest() {
			const form = await fixture<HTMLFormElement>(html`
				<form>
					<div><test-button></test-button></div>
				</form>
			`);
			form.addEventListener('submit', (event: Event) => event.preventDefault());

			const button = form.querySelector<TestButton>('test-button');
			if (!button) {
				throw new Error('Could not query rendered <test-button>.');
			}

			return { form, button };
		}

		describe('type="submit"', () => {
			it('should submit the form when clicked', async () => {
				// Arrange
				const { button, form } = await setupFormTest();
				let lastEvent!: SubmitEvent;
				const submitListener = sinon.fake((event: SubmitEvent) => (lastEvent = event));
				form.addEventListener('submit', submitListener);
				button.type = 'submit';
				await elementUpdated(button);

				// Act
				button.click();
				await nextMacrotask(); // time to bubble up

				// Assert
				expect(submitListener).calledOnceWith(sinon.match.instanceOf(SubmitEvent));
				expect(lastEvent.submitter).equal(button);
			});

			it('should not submit the form when click event is defaultPrevented', async () => {
				// Arrange
				const { button, form } = await setupFormTest();
				button.parentElement!.addEventListener('click', (event) => event.preventDefault());
				const submitListener = sinon.fake();
				form.addEventListener('submit', submitListener);
				button.type = 'submit';
				await elementUpdated(button);

				// Act
				button.click();
				await nextMacrotask(); // time to bubble up

				// Assert
				expect(submitListener).callCount(0);
			});
		});

		describe('type="reset"', () => {
			it('should reset the form when clicked', async () => {
				// Arrange
				const { button, form } = await setupFormTest();
				const resetListener = sinon.fake();
				form.addEventListener('reset', resetListener);
				button.type = 'reset';
				await elementUpdated(button);

				// Act
				button.click();
				await nextMacrotask(); // time to bubble up

				// Assert
				expect(resetListener).calledOnceWith(sinon.match.instanceOf(Event));
			});

			it('should not reset the form when click event is defaultPrevented', async () => {
				// Arrange
				const { button, form } = await setupFormTest();
				button.parentElement!.addEventListener('click', (event) => event.preventDefault());
				const submitListener = sinon.fake();
				form.addEventListener('reset', submitListener);
				button.type = 'reset';
				await elementUpdated(button);

				// Act
				button.click();
				await nextMacrotask(); // time to bubble up

				// Assert
				expect(submitListener).callCount(0);
			});
		});
	});
});
