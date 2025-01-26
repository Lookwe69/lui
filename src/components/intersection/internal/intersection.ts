import { html } from 'lit';
import { property } from 'lit/decorators.js';
import { IntersectionController } from '@lit-labs/observers/intersection-controller.js';

import { effect, EffectGroupController } from '@lookwe/lit-controllers';
import { stringConverter } from '@lookwe/lit-converters';
import { internals, mixinElementInternals } from '@lookwe/lit-mixins';

import { LuiElement } from '../../../internal/lui-element';
import { IntersectionIntersectingChangeEvent } from '../event/intersection-intersecting-change-event';

declare global {
	interface HTMLElementEventMap {
		'intersection:intersecting-change': IntersectionIntersectingChangeEvent;
	}
}

const BaseClass = mixinElementInternals(LuiElement);

/**
 * An element that observes the intersection of itself with another element or the top-level document's viewport.
 */
export class Intersection extends BaseClass {
	/**
	 * The ID of the element to use as the intersection root.
	 */
	@property({ reflect: true, attribute: 'root-id', converter: stringConverter })
	accessor rootId = '';

	#root: IntersectionObserverInit['root'];
	/**
	 * The element to use as the intersection root. Can be an Element or null.
	 */
	@property({ attribute: false })
	set root(root: IntersectionObserverInit['root']) {
		this.#root = root;
	}
	get root() {
		if (this.#root && this.#root.isConnected) return this.#root;
		return (this.#root = this.#getRoot());
	}

	/**
	 * The margins (in pixels or as percentages) around the root within which to consider the target as intersecting.
	 */
	@property({ attribute: 'root-margin' })
	accessor rootMargin: IntersectionObserverInit['rootMargin'];

	/**
	 * A single number or an array of numbers between 0.0 and 1.0 representing the intersection ratio that the target must
	 * have with the root before the observer will report that the target is intersecting.
	 */
	@property({ type: Number })
	accessor threshold: IntersectionObserverInit['threshold'];

	#isIntersecting: boolean | undefined;
	/**
	 * Indicates whether the element is currently intersecting with the root.
	 */
	get isIntersecting() {
		return this.#isIntersecting;
	}

	#getRoot() {
		if (!this.rootId) return undefined;
		const root = this.getRootNode() as ParentNode;
		return root.querySelector(`#${CSS.escape(this.rootId)}`);
	}

	#observer: IntersectionController | undefined;

	#getNewController() {
		return new IntersectionController(this, {
			config: { root: this.root, rootMargin: this.rootMargin, threshold: this.threshold },
			callback: this.#handleIntersectionCallback.bind(this),
		});
	}

	constructor() {
		super();
		this[internals].role = 'none';
	}

	#_effects = new EffectGroupController(
		this,
		effect(
			() => {
				if (this.#observer) {
					this.#observer.unobserve(this);
					this.removeController(this.#observer);
				}
				this.#observer = this.#getNewController();
			},
			() => [this.root, this.rootMargin, this.threshold],
		),
	);

	override render() {
		return html`<slot></slot>`;
	}

	#handleIntersectionCallback(entries: Array<IntersectionObserverEntry>) {
		const oldValue = this.#isIntersecting;
		for (const entry of entries) {
			this.#isIntersecting = entry.isIntersecting;
		}
		if (oldValue !== this.#isIntersecting) {
			this.dispatchEvent(
				new IntersectionIntersectingChangeEvent('intersection:intersecting-change', {
					oldSate: oldValue,
					newState: this.#isIntersecting!,
				}),
			);
		}
	}
}
