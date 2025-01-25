import { setPlopHelpers } from './plop-utils.js';

export default function (plop) {
	setPlopHelpers(plop);

	plop.setGenerator('component', {
		description: 'Generate a new component',
		prompts: [
			{
				type: 'input',
				name: 'tag',
				message: 'Tag name? (e.g. lui-button)',
				validate: (value) => {
					if (!/^lui-[a-z-+]+/.test(value)) {
						return false;
					}

					if (value.includes('--') || value.endsWith('-')) {
						return false;
					}

					return true;
				},
			},
		],
		actions: [
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tag }}.ts',
				templateFile: 'templates/component/define.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/internal/{{ tagWithoutPrefix tag }}.ts',
				templateFile: 'templates/component/component.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/internal/{{ tagWithoutPrefix tag }}.styles.scss',
				templateFile: 'templates/component/styles.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/internal/{{ tagWithoutPrefix tag }}.tokens.scss',
				templateFile: 'templates/component/styles-tokens.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/internal/{{ tagWithoutPrefix tag }}.test.ts',
				templateFile: 'templates/component/internal-tests.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ tagWithoutPrefix tag }}/{{ tag }}.test.ts',
				templateFile: 'templates/component/tests.hbs',
			},
			{
				type: 'modify',
				path: '../../src/components/all.ts',
				pattern: /\/\* plop:component \*\//,
				template: `export * from './{{ tagWithoutPrefix tag }}/{{ tag }}';\n/* plop:component */`,
			},
		],
	});
}
