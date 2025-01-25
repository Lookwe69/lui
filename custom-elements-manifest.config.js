import commandLineArgs from 'command-line-args';
import { customElementJetBrainsPlugin } from 'custom-element-jet-brains-integration';
import { customElementVsCodePlugin } from 'custom-element-vs-code-integration';

import { discoverCSSPropertiesPlugin } from './share-config/cem-plugin/discover-css-properties-plugin.js';
import { transformModulePathsPlugin } from './share-config/cem-plugin/transform-module-paths-plugin.js';
import tsConfig from './tsconfig.json' with { type: 'json' };

const { outdir } = commandLineArgs([
	{ name: 'litelement', type: String },
	{ name: 'analyze', defaultOption: true },
	{ name: 'outdir', type: String },
]);

let typeChecker;

export default {
	outdir,
	globs: ['src/components/**/*.ts'],
	exclude: ['**/*.test.ts', '**/testing/**/*'],
	overrideModuleCreation: ({ ts, globs }) => {
		const program = ts.createProgram(globs, tsConfig);
		typeChecker = program.getTypeChecker();

		return program.getSourceFiles().filter((sf) => globs.find((glob) => sf.fileName.includes(glob)));
	},
	plugins: [
		transformModulePathsPlugin({ stripRegex: /^.*\/?src\//, transformTsToJs: true }),

		discoverCSSPropertiesPlugin(() => typeChecker, {
			transformPath: (path) => `${import.meta.dirname}/src/${path}`,
		}),

		// Generate custom VS Code data
		customElementVsCodePlugin({
			outdir,
			cssFileName: null,
		}),

		customElementJetBrainsPlugin({
			outdir,
			excludeCss: true,
			packageJson: false,
		}),
	],
};
