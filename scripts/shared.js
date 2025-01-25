/**
 * Gets an array of components from a CEM object.
 */
export function getAllComponents(metadata) {
	const allComponents = [];

	metadata.modules.map((module) => {
		module.declarations?.map((declaration) => {
			if (declaration.customElement && declaration.tagName) {
				const component = declaration;
				const path = module.path;

				if (component) {
					component.path = path;
					allComponents.push(component);
				}
			}
		});
	});

	return allComponents;
}
