import { Button } from './button';

declare global {
	interface HTMLElementEventMap {}
}

export class OutlinedButton extends Button {}
