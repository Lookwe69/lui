import { setPlopHelpers } from './plop-utils.js';

export default function (plop) {
	setPlopHelpers(plop);

	plop.setGenerator('variant component', {
		description: 'Generate a new variant component',
		prompts: [
			{
				type: 'input',
				name: 'tag',
				message: 'Tag name ? (e.g. lui-text-button)',
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
			{
				type: 'input',
				name: 'baseClass',
				message: 'Base class name ? (e.g. Button)',
				validate: (value) => {
					if (value[0] !== value[0].toUpperCase()) {
						return false;
					}

					return true;
				},
			},
		],
		actions: [
			{
				type: 'add',
				path: '../../src/components/{{ kebabCase baseClass }}/{{ tag }}.ts',
				templateFile: 'templates/component/define.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ kebabCase baseClass }}/internal/{{ tagWithoutPrefix tag }}.ts',
				templateFile: 'templates/component/variant-component.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ kebabCase baseClass }}/internal/{{ tagWithoutPrefix tag }}.styles.scss',
				templateFile: 'templates/component/variant-styles.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ kebabCase baseClass }}/internal/{{ tagWithoutPrefix tag }}.tokens.scss',
				templateFile: 'templates/component/styles-tokens.hbs',
			},
			{
				type: 'add',
				path: '../../src/components/{{ kebabCase baseClass }}/{{ tag }}.test.ts',
				templateFile: 'templates/component/tests.hbs',
			},
			{
				type: 'modify',
				path: '../../src/components/all.ts',
				pattern: /\/\* plop:component \*\//,
				template: `export * from './{{ kebabCase baseClass }}/{{ tag }}';\n/* plop:component */`,
			},
		],
	});
}
