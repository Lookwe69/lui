export function setPlopHelpers(plop) {
	plop.setHelper('tagWithoutPrefix', (tag) => {
		return tag.replace(/^lui-/, '');
	});
	plop.setHelper('pascalCaseTagWithoutPrefix', (tag) => {
		const withoutPrefix = plop.getHelper('tagWithoutPrefix');
		const pascalCase = plop.getHelper('pascalCase');
		return pascalCase(withoutPrefix(tag));
	});

	plop.setHelper('camelCaseTagWithoutPrefix', (tag) => {
		const withoutPrefix = plop.getHelper('tagWithoutPrefix');
		const camelCase = plop.getHelper('camelCase');
		return camelCase(withoutPrefix(tag));
	});
}
