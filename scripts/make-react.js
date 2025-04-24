import fs from 'fs';
import path from 'path';

import commandLineArgs from 'command-line-args';
import { deleteSync } from 'del';
import prettier from 'prettier';

import prettierConfig from '../prettier.config.js';
import { getAllComponents } from './shared.js';

const { customElements } = commandLineArgs({ name: 'customElements', type: String });

const reactDir = path.join('./src/react');

// Clear build directory
deleteSync(reactDir);
fs.mkdirSync(reactDir, { recursive: true });

// Fetch component metadata
const metadata = JSON.parse(fs.readFileSync(customElements, 'utf8'));
const components = getAllComponents(metadata);
const index = [];

for (const component of components) {
	const rootComponentDir = component.path.substring(0, component.path.lastIndexOf('/'));
	const className = component.name;
	const importPath = component.path.replace(/\.[^/.]+$/, ''); // remove file extension
	const events = (component.events ?? [])
		.map((event) => {
			if (!event.name) return null;
			let eventClassName = event?.type?.text ?? 'Event';

			return {
				...event,
				reactName:
					'on' +
					event.name
						.split(/[-:]/)
						.map((str) => str[0].toUpperCase() + str.slice(1))
						.join(''),
				className: eventClassName,
			};
		})
		.filter((event) => event !== null);
	const eventImports = [
		...new Set(
			events
				.map((event) => {
					const eventClassName = event.className;
					const fileEvent = eventClassName.replace(/([a-z0–9])([A-Z])/g, '$1-$2').toLowerCase(); // PascalCase to kebab-case
					const pathClassEvent = `${rootComponentDir}/event/${fileEvent}`;
					if (!fs.existsSync(path.join(`./src/${pathClassEvent}.ts`))) {
						return null;
					}
					return `import { ${eventClassName} } from "../${pathClassEvent}";`;
				})
				.filter((imp) => imp !== null),
		),
	].join('\n');
	const eventNameImport = events.length > 0 ? `import { type EventName } from '@lit/react';` : ``;
	const eventsObjLines = events
		.map((event) => `${event.reactName}: '${event.name}' as EventName<${event.className}>`)
		.join(',\n');

	const description = component.description || '';
	const summary = component.summary || '';
	const jsDoc =
		description || summary
			? '/**\n' +
				description
					.split('\n')
					.map((line) => `* ${line}\n`)
					.join('') +
				(summary ? `*\n* @summary ${summary}\n` : '') +
				'*/'
			: '';

	const source = await prettier.format(
		`
		import * as React from 'react';
		import { createComponent } from '@lit/react';
		import { ${className} as Component } from '../${importPath}.js';

		export { ${className} as ${className}Element } from '../${importPath}.js';

		${eventNameImport}
		${eventImports}

		${jsDoc}
		export const ${className} = createComponent({
			tagName: '${component.tagName}',
			elementClass: Component,
			react: React,
			events: {
				${eventsObjLines}
			},
			displayName: "${component.name}"
		});

		export type ${className}Props = React.ComponentProps<typeof ${className}>;
    `,
		{ ...prettierConfig, parser: 'typescript' },
	);

	index.push(`export * from './${className}.js';`);

	fs.writeFileSync(path.join(reactDir, `${className}.ts`), source, 'utf8');
}

// Generate the index file
fs.writeFileSync(path.join(reactDir, 'all.ts'), index.join('\n'), 'utf8');
