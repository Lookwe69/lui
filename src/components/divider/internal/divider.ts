import { property } from 'lit/decorators.js';

import { effect, EffectGroupController } from '@lookwe/lit-controllers';
import { internals, mixinElementInternals } from '@lookwe/lit-mixins';

import { LuiElement } from '../../../internal/lui-element';

declare global {
	interface HTMLElementEventMap {}
}

const BaseClass = mixinElementInternals(LuiElement);

export class Divider extends BaseClass {
	/**
	 * Draws the divider in a vertical orientation.
	 */
	@property({ type: Boolean, reflect: true })
	accessor vertical = false;

	constructor() {
		super();
		this[internals].role = 'separator';
	}

	#_effects = new EffectGroupController(
		this,
		effect(
			([vertical]) => (this[internals].ariaOrientation = vertical ? 'vertical' : 'horizontal'),
			() => [this.vertical],
		),
	);
}
