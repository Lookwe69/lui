import { property } from 'lit/decorators.js';

import { effect, EffectGroupController } from '@lookwe/lit-controllers/effect-group';
import { internals, mixinElementInternals } from '@lookwe/lit-mixins/element-internals';

import { LuiElement } from '../../../internal/lui-element.js';

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
