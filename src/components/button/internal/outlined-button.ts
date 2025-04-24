import { Button } from './button.js';

declare global {
	interface HTMLElementEventMap {}
}

export class OutlinedButton extends Button {}
