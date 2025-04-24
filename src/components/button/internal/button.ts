import { html, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

import { SlotController } from '@lookwe/lit-controllers/slot';

import { addActivationListener } from '../../../internal/event/form-label-activation.js';
import { LuiElement } from '../../../internal/lui-element.js';
import { FormSubmitterController } from './controller/form-submitter-controller.js';
import { mixinPopoverTarget } from '@lookwe/lit-mixins/popover-target';
import { getFocusElement, mixinDelegatesFocus } from '@lookwe/lit-mixins/delegate-focus';
import { getFormValue, mixinFormAssociated } from '@lookwe/lit-mixins/form-associated';
import { mixinElementInternals } from '@lookwe/lit-mixins/element-internals';

declare global {
	interface HTMLElementEventMap {}
}

const BaseClass = mixinElementInternals(LuiElement);

export class Button extends BaseClass {
	/**
	 * The URL that the link button points to.
	 */
	@property()
	accessor href = '';

	/**
	 * Tells the browser to download the linked file as this filename. Only used when `href` is set.
	 */
	@property({ type: Boolean })
	accessor download = false;

	/**
	 * Where to display the linked `href` URL for a link button. Common options include `_blank` to open in a new tab.
	 */
	@property()
	accessor target: '_blank' | '_parent' | '_self' | '_top' | '' = '';

	/**
	 * Whether to render the icon at the inline end of the label rather than the inline start.
	 */
	@property({ type: Boolean, attribute: 'trailing-icon', reflect: true })
	accessor trailingIcon = false;

	/**
	 * The default behavior of the button. May be "button", "reset", or "submit"
	 * (default=button).
	 */
	@property()
	accessor type: 'button' | 'reset' | 'submit' = 'button';

	/**
	 * The value added to a form with the button's name when the button submits a form.
	 */
	@property({ reflect: true, useDefault: true })
	accessor value = '';

	/**
	 * Button size.
	 */
	@property()
	accessor size: 'small' | 'medium' | 'large' = 'medium';

	@state() accessor #hasLabel = false;

	@query('.button')
	accessor #buttonElement!: HTMLButtonElement | HTMLAnchorElement | null;

	get #canClick() {
		return !this.disabled;
	}

	#slotController = new SlotController(this);

	#_formSubmitterController = new FormSubmitterController(this);

	constructor() {
		super();
		addActivationListener(this, () => this.#buttonElement, {
			check: (event) => {
				if (!this.#canClick) {
					event.stopImmediatePropagation();
					event.preventDefault();
				}
			},
		});
	}

	#classButton() {
		return {
			'button': true,
			[`size-${this.size}`]: true,
			'disabled': this.disabled,
		};
	}

	#renderButton() {
		return html`
			<button
				part="base"
				class=${classMap(this.#classButton())}
				type=${this.type}
				?disabled=${!this.#canClick}
				.popoverTargetElement=${this.popoverTargetElement}
				.popoverTargetAction=${this.popoverTargetAction}
			>
				${this.#renderContent()}
			</button>
		`;
	}

	#renderLink() {
		return html`
			<a
				part="base"
				class=${classMap(this.#classButton())}
				href=${this.href}
				target=${this.target || nothing}
				tabindex=${this.#canClick ? 0 : -1}
				?download=${this.download}
			>
				${this.#renderContent()}
			</a>
		`;
	}

	override render() {
		return this.href ? this.#renderLink() : this.#renderButton();
	}

	#renderContent() {
		const slotIcon = html`<slot name="icon"></slot>`;

		return html`
			${this.trailingIcon ? nothing : slotIcon}
			<span class="label" ?hidden=${!this.#slotController.hasAssignedNodes()}>
				<slot></slot>
			</span>
			${this.trailingIcon ? slotIcon : nothing}
		`;
	}

	override [getFormValue]() {
		return null;
	}
	override formResetCallback() {}
	override formStateRestoreCallback(_state: string) {}

	override [getFocusElement](): HTMLElement | null {
		return this.#buttonElement;
	}
}
