import { CSSResultOrNative } from 'lit';

import { Divider } from './internal/divider.js';
import styles from './internal/divider.styles.scss';

declare global {
	interface HTMLElementTagNameMap {
		'lui-divider': LuiDivider;
	}
}

export class LuiDivider extends Divider {
	static override styles: CSSResultOrNative[] = [...super.styles, styles];
}
customElements.define('lui-divider', LuiDivider);
