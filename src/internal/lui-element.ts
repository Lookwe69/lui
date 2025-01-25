import { CSSResultOrNative, LitElement } from 'lit';

import styles from './styles/lui-element.styles.scss';

export class LuiElement extends LitElement {
	static override styles: Array<CSSResultOrNative> = [styles];
}
