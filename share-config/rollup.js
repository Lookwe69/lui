import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss';
import litcss from 'rollup-plugin-postcss-lit';

import pkg from '../package.json' with { type: 'json' };

export function shareExternalPackages({ includeDevDep = false } = {}) {
	return [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
		...(includeDevDep ? Object.keys(pkg.devDependencies || {}) : []),
	];
}

export function shareRegexesOfPackages(options) {
	const externalPackages = shareExternalPackages(options);

	// Creating regexes of the packages to make sure subpaths of the
	// packages are also treated as external
	const regexesOfPackages = externalPackages.map(
		(packageName) => new RegExp(`^${packageName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}(\/.*)?`),
	);
	return regexesOfPackages;
}

export function sharePlugins({ typescriptConfig } = {}) {
	return [
		literalsHtmlCssMinifier(),
		resolve({
			browser: true,
		}),
		typescript(typescriptConfig),
		postcss({
			minimize: true,
			inject: false,
		}),
		litcss(),
	];
}
