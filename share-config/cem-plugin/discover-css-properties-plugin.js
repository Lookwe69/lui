import path from 'path';

import * as sass from 'sass';

/**
 * @param {() => import('typescript').TypeChecker}       getTypechecker
 * @param {{ transformPath?: (path: string) => string }} options
 */
export function discoverCSSPropertiesPlugin(getTypechecker, { transformPath = (path) => path } = {}) {
	/**
	 * @type {import('typescript').TypeChecker}
	 */
	let typechecker;

	return {
		name: 'discover-css-properties',
		initialize() {
			typechecker = getTypechecker();
		},
		analyzePhase({ ts, node, moduleDoc }) {
			switch (node?.kind) {
				case ts.SyntaxKind.ClassDeclaration:
					handleCSSProperties(ts, typechecker, node, moduleDoc, transformPath);
					break;
			}
		},
	};
}

/**
 * @param {import('typescript')}                  ts
 * @param {import('typescript').TypeChecker}      checker
 * @param {import('typescript').ClassDeclaration} classNode
 * @param {*}                                     moduleDoc
 * @param {(path: string) => string}              transformPath
 */
function handleCSSProperties(ts, checker, classNode, moduleDoc, transformPath) {
	const className = classNode.name?.getText();

	const currClass = moduleDoc?.declarations?.find((declaration) => declaration.name === className);

	classNode.members?.forEach((member) => {
		if (!isStaticStyles(ts, member)) return;

		const propertyInitializer = member.initializer;
		if (propertyInitializer && ts.isArrayLiteralExpression(propertyInitializer)) {
			const identifiers = propertyInitializer.elements.filter((element) => ts.isIdentifier(element));
			identifiers.forEach((identifier) => {
				const originalNode = checker.getSymbolAtLocation(identifier);
				const parent = originalNode.declarations[0]?.parent;
				if (parent && ts.isImportDeclaration(parent)) {
					const modulePath = parent.moduleSpecifier.getText().replaceAll(/['"]/g, '');
					if (typeof modulePath === 'string' && modulePath.endsWith('.scss')) {
						const filePath = transformPath(path.join(path.dirname(moduleDoc.path), modulePath));

						const result = sass.compile(filePath);
						analyzeCSS(result.css, currClass);
					}
				}
			});
		}
	});
}

function isStaticStyles(ts, node) {
	return (
		node?.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.StaticKeyword) &&
		node?.name?.getText() === 'styles'
	);
}

/**
 * @param {string} css
 * @param {*}      moduleDoc
 */
function analyzeCSS(css, currClass) {
	for (const [_prop, { cssVar, cssDefault }] of getPrivateProps(css)) {
		currClass.cssProperties ??= [];
		let currentCssProperty = currClass.cssProperties.find((cssProprety) => cssProprety.name === cssVar);
		if (!currentCssProperty) {
			currentCssProperty = {
				name: cssVar,
			};
			currClass.cssProperties.push(currentCssProperty);
		}
		currentCssProperty.default = cssDefault;
	}
}

/**
 * @param {string} css
 * @returns {Map<string, { cssVar: string; cssDefault: string }>}
 */
function getPrivateProps(css) {
	const regex = /(?<prop>--__?[a-z-\d]+): var\((?<cssVar>[a-z-\d]+), (?<cssDefault>[^;]+)\);/g;
	const privateProps = new Map();
	let result;
	while ((result = regex.exec(css)) !== null) {
		const { prop, cssVar, cssDefault } = result.groups;
		privateProps.set(prop, { cssVar, cssDefault });
	}
	return privateProps;
}
