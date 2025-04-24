import './lui-intersection.js';

import { expect, fixture, html } from '@open-wc/testing';

import { createTokenTests } from '../../testing/tokens.js';
import { LuiIntersection } from './lui-intersection.js';

describe('<lui-intersection>', () => {
	describe('.styles', () => {
		createTokenTests(LuiIntersection.styles);
	});

	it('should render a component', async () => {
		const el = await fixture(html`<lui-intersection></lui-intersection>`);

		expect(el).match(':defined');
	});
});
