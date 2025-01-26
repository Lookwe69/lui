import './lui-intersection';

import { expect, fixture, html } from '@open-wc/testing';

import { createTokenTests } from '../../testing/tokens';
import { LuiIntersection } from './lui-intersection';

describe('<lui-intersection>', () => {
	describe('.styles', () => {
		createTokenTests(LuiIntersection.styles);
	});

	it('should render a component', async () => {
		const el = await fixture(html`<lui-intersection></lui-intersection>`);

		expect(el).match(':defined');
	});
});
