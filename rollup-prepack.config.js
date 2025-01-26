import { sharePlugins, shareRegexesOfPackages } from './share-config/rollup.js';

export default {
	external: shareRegexesOfPackages(),

	input: ['src/components/all.ts', 'src/react/all.ts'],
	output: [
		{
			dir: './',
			format: 'es',
			sourcemap: false,
			preserveModules: true,
		},
	],

	plugins: [
		...sharePlugins({
			typescriptConfig: {
				exclude: ['**/*.test.ts', '**/testing/**/*'],
				compilerOptions: {
					outDir: './',
					sourceMap: false,
					declarationMap: false,
				},
			},
		}),
	],
};
