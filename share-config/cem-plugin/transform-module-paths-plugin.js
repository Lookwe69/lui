function replace(string, terms) {
	terms.forEach(({ from, to }) => {
		string = string?.replace(from, to);
	});

	return string;
}

/**
 * @param {{ stripRegex?: RegExp; transformTsToJs?: boolean }} options
 */
export function transformModulePathsPlugin({ stripRegex, transformTsToJs = false } = {}) {
	return {
		name: 'transform-module-paths',
		analyzePhase({ moduleDoc: mod }) {
			const terms = [];
			if (stripRegex) {
				terms.push({ from: stripRegex, to: '' });
			}
			if (transformTsToJs) {
				terms.push({ from: /\.(t|j)sx?$/, to: '.js' }); // Convert .ts to .js
			}

			mod.path = replace(mod.path, terms);

			for (const ex of mod.exports ?? []) {
				ex.declaration.module = replace(ex.declaration.module, terms);
			}

			for (const dec of mod.declarations ?? []) {
				if (dec.kind === 'class') {
					for (const arrayField of ['superclass', 'mixins']) {
						const fields = dec[arrayField] ?? [];
						for (const field of Array.isArray(fields) ? fields : [fields]) {
							field.module = replace(field.module, terms);
						}
					}
					for (const arrayField of [
						'members',
						'attributes',
						'events',
						'slots',
						'cssParts',
						'cssProperties',
						'cssStates',
					]) {
						const fields = dec[arrayField] ?? [];
						for (const field of Array.isArray(fields) ? fields : [fields]) {
							const inheritedFrom = field.inheritedFrom;
							if (inheritedFrom) {
								inheritedFrom.module = replace(inheritedFrom.module, terms);
							}
						}
					}
				}
			}
		},
	};
}
