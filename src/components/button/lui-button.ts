import { CSSResultOrNative } from 'lit';

import { Button } from './internal/button.js';
import styles from './internal/button.styles.scss';

declare global {
	interface HTMLElementTagNameMap {
		'lui-button': LuiButton;
	}
}

export class LuiButton extends Button {
	static override styles: CSSResultOrNative[] = [...super.styles, styles];
}
customElements.define('lui-button', LuiButton);
