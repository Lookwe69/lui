import { property } from 'lit/decorators.js';

import { effect, EffectGroupController } from '../../../internal/controller/effect-group-controller';
import { LuiElement } from '../../../internal/lui-element';
import { internals, mixinElementInternals } from '../../../internal/mixin/element-internals';

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
