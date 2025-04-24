import './lui-button.js';

import { expect, fixture, html } from '@open-wc/testing';

import { createTokenTests } from '../../testing/tokens.js';
import { LuiButton } from './lui-button.js';

describe('<lui-button>', () => {
	describe('.styles', () => {
		createTokenTests(LuiButton.styles);
	});

	it('should render a component', async () => {
		const el = await fixture(html`<lui-button></lui-button>`);

		expect(el).match(':defined');
	});
});
