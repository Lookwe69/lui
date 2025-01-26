import './lui-divider';

import { expect, fixture, html } from '@open-wc/testing';

import { createTokenTests } from '../../testing/tokens';
import { LuiDivider } from './lui-divider';

describe('<lui-divider>', () => {
	describe('.styles', () => {
		createTokenTests(LuiDivider.styles);
	});

	it('should render a component', async () => {
		const el = await fixture(html`<lui-divider></lui-divider>`);

		expect(el).match(':defined');
	});
});
