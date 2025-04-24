import { CSSResultOrNative } from 'lit';

import { OutlinedButton } from './internal/outlined-button.js';
import styles from './internal/outlined-button.styles.scss';

declare global {
	interface HTMLElementTagNameMap {
		'lui-outlined-button': LuiOutlinedButton;
	}
}

export class LuiOutlinedButton extends OutlinedButton {
	static override styles: CSSResultOrNative[] = [...super.styles, styles];
}
customElements.define('lui-outlined-button', LuiOutlinedButton);
