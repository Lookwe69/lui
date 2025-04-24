import { CSSResultOrNative } from 'lit';

import { Intersection } from './internal/intersection.js';
import styles from './internal/intersection.styles.scss';

declare global {
	interface HTMLElementTagNameMap {
		'lui-intersection': LuiIntersection;
	}
}

export class LuiIntersection extends Intersection {
	static override styles: CSSResultOrNative[] = [...super.styles, styles];
}
customElements.define('lui-intersection', LuiIntersection);
