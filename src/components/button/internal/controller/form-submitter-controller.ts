import { ReactiveController, ReactiveControllerHost } from 'lit';

import { internals, WithElementInternals } from '@lookwe/lit-mixins';
import { nextMacrotask } from '@lookwe/utils';

export interface FormSubmitterControllerHost extends HTMLElement, ReactiveControllerHost, WithElementInternals {
	type: 'button' | 'reset' | 'submit';
	name: string;
	value: string;
}

/**
 * A controller that handles click to submit form.
 */
export class FormSubmitterController implements ReactiveController {
	readonly #host;

	constructor(host: FormSubmitterControllerHost) {
		(this.#host = host).addController(this);
	}

	#clearController?: AbortController;

	hostConnected(): void {
		this.#clearController ??= new AbortController();
		const signal = this.#clearController.signal;

		this.#host.addEventListener('click', this.#handleClick.bind(this), { signal });
	}

	hostDisconnected(): void {
		this.#clearController?.abort();
		this.#clearController = undefined;
	}

	async #handleClick(event: MouseEvent) {
		const { [internals]: elementInternals, type } = this.#host;
		const { form } = elementInternals;

		if (!form || type === 'button') return;

		// Wait a full task for event bubbling to complete.
		await nextMacrotask();

		if (event.defaultPrevented) return;

		switch (type) {
			case 'reset':
				form.reset();
				break;

			case 'submit':
				// form.requestSubmit(submitter) does not work with form associated custom
				// elements. This patches the dispatched submit event to add the correct
				// `submitter`.
				// See https://github.com/WICG/webcomponents/issues/814
				form.addEventListener(
					'submit',
					(submitEvent) => {
						Object.defineProperty(submitEvent, 'submitter', {
							configurable: true,
							enumerable: true,
							get: () => this.#host,
						});
					},
					{ capture: true, once: true },
				);

				elementInternals.setFormValue(this.#host.value);
				form.requestSubmit();
		}
	}
}
