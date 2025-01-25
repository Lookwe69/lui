import './lui-outlined-button';

import { expect, fixture, html } from '@open-wc/testing';

import { createTokenTests } from '../../testing/tokens';
import { LuiOutlinedButton } from './lui-outlined-button';

describe('<lui-outlined-button>', () => {
	describe('.styles', () => {
		createTokenTests(LuiOutlinedButton.styles);
	});

	it('should render a component', async () => {
		const el = await fixture(html`<lui-outlined-button></lui-outlined-button>`);

		expect(el).match(':defined');
	});
});
