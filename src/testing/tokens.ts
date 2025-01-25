import { CSSResultOrNative } from 'lit';

import { expect } from '@open-wc/testing';

export function createTokenTests(styles: CSSResultOrNative[]) {
	it('should not have any undefined tokens', () => {
		const undefinedTokens = getUndefinedTokens(styles);

		expect(undefinedTokens).length(0);
	});

	it('should not have any unused tokens', () => {
		const unusedTokens = getUnusedTokens(styles);

		expect(unusedTokens).length(0);
	});
}

export function getUndefinedTokens(styles: CSSResultOrNative[]) {
	let defined = new Set<string>();
	let used = new Set<string>();
	for (const styleSheet of cssResultsToStyleSheets(styles)) {
		defined = new Set([...defined, ...getDefinedTokensFromRule(styleSheet)]);
		used = new Set([...used, ...getUsedTokensFromRule(styleSheet)]);
	}

	const undefinedTokens: string[] = [];
	for (const usedToken of used) {
		if (!defined.has(usedToken) && !usedToken.startsWith('--__')) {
			undefinedTokens.push(usedToken);
		}
	}

	return undefinedTokens;
}

export function getUnusedTokens(styles: CSSResultOrNative[]) {
	let defined = new Set<string>();
	let used = new Set<string>();
	for (const styleSheet of cssResultsToStyleSheets(styles)) {
		defined = new Set([...defined, ...getDefinedTokensFromRule(styleSheet)]);
		used = new Set([...used, ...getUsedTokensFromRule(styleSheet)]);
	}

	const unusedTokens: string[] = [];
	for (const definedToken of defined) {
		if (!used.has(definedToken) && !definedToken.startsWith('--__')) {
			unusedTokens.push(definedToken);
		}
	}

	return unusedTokens;
}

function getDefinedTokensFromRule(rule: CSSRule | CSSStyleSheet | CSSStyleRule): Set<string> {
	let defined = new Set<string>();
	if ('cssRules' in rule) {
		for (const childRule of rule.cssRules) {
			defined = new Set([...defined, ...getDefinedTokensFromRule(childRule)]);
		}
	}

	if ('style' in rule) {
		for (const property of rule.style) {
			if (property.startsWith('--_')) {
				defined.add(property);
			}
		}
	}

	return defined;
}

function getUsedTokensFromRule(rule: CSSRule | CSSStyleSheet | CSSStyleRule): Set<string> {
	let used = new Set<string>();
	if ('cssRules' in rule) {
		for (const childRule of rule.cssRules) {
			used = new Set([...used, ...getUsedTokensFromRule(childRule)]);
		}
	}

	if ('style' in rule) {
		// Shorthand properties are not included in CSSStyleDeclaration's iterator.
		// Check them explicitly as well for properties like border-radius.
		for (const property of [...rule.style, ...CSS_SHORTHAND_PROPERTIES]) {
			const value = rule.style.getPropertyValue(property);
			for (const match of value.matchAll(/--_[\w-]+/g)) {
				used.add(match[0]);
			}
		}
	}

	return used;
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#shorthand_properties
const CSS_SHORTHAND_PROPERTIES = [
	'all',
	'animation',
	'animation-range',
	'background',
	'border',
	'border-block',
	'border-block-end',
	'border-block-start',
	'border-bottom',
	'border-color',
	'border-image',
	'border-inline',
	'border-inline-end',
	'border-inline-start',
	'border-left',
	'border-radius',
	'border-right',
	'border-style',
	'border-top',
	'border-width',
	'column-rule',
	'columns',
	'contain-intrinsic-size',
	'container',
	'flex',
	'flex-flow',
	'font',
	'font-synthesis',
	'font-variant',
	'gap',
	'grid',
	'grid-area',
	'grid-column',
	'grid-row',
	'grid-template',
	'inset',
	'inset-block',
	'inset-inline',
	'list-style',
	'margin',
	'margin-block',
	'margin-inline',
	'mask',
	'mask-border',
	'offset',
	'outline',
	'overflow',
	'overscroll-behavior',
	'padding',
	'padding-block',
	'padding-inline',
	'place-content',
	'place-items',
	'place-self',
	'position-try',
	'scroll-margin',
	'scroll-margin-block',
	'scroll-margin-inline',
	'scroll-padding',
	'scroll-padding-block',
	'scroll-padding-inline',
	'scroll-timeline',
	'text-decoration',
	'text-emphasis',
	'text-wrap',
	'transition',
	'view-timeline',
	'-webkit-text-stroke',
	'-webkit-border-before',
	'-webkit-mask-box-image',
];

function cssResultsToStyleSheets(styles: CSSResultOrNative[]): CSSStyleSheet[] {
	return styles.map((style) => {
		if (style instanceof CSSStyleSheet) {
			return style;
		}

		if (!style.styleSheet) {
			throw new Error('CSSResult.styleSheet is not supported.');
		}

		return style.styleSheet;
	});
}
