import { nextMicrotask } from '@lookwe/utils/event-loop';

export function isActivationClick(event: Event) {
	// Event must start at the event target.
	if (event.currentTarget !== event.target) {
		return false;
	}
	// Event must not be retargeted from shadowRoot.
	if (event.composedPath()[0] !== event.target) {
		return false;
	}
	// Target must not be disabled; this should only occur for a synthetically
	// dispatched click.
	if ((event.target as EventTarget & { disabled: boolean }).disabled) {
		return false;
	}

	return true;
}

export function dispatchActivationClick(element: HTMLElement) {
	const event = new MouseEvent('click', { bubbles: true });
	element.dispatchEvent(event);
	return event;
}

export function addActivationListener(
	root: HTMLElement,
	delegateElement: () => HTMLElement | null,
	options: { check?: (event: MouseEvent) => void | boolean; focus?: boolean } = {},
) {
	root.addEventListener(
		'click',
		(event) => {
			if (options.check?.(event) === false) return;
			if (event.defaultPrevented) return;

			const element = delegateElement();
			if (!isActivationClick(event) || squelchEventFix(event) || !element) return;

			if (options.focus !== false) root.focus();
			dispatchActivationClick(element);
		},
		{ capture: true },
	);
}

// TODO(https://bugzilla.mozilla.org/show_bug.cgi?id=1804576)
// Remove when Firefox bug is addressed.
const isSquelchingEventTargets = new Set<EventTarget | null>();
function squelchEventFix(event: Event) {
	// `Event.explicitOriginalTarget` only exists in Firefox
	const eventTarget = (event as Event & { explicitOriginalTarget?: EventTarget }).explicitOriginalTarget ?? null;
	if (!eventTarget) return false;

	const squelched = isSquelchingEventTargets.has(eventTarget);
	if (squelched) {
		event.preventDefault();
		event.stopImmediatePropagation();
	}
	squelchEventsForMicrotask(eventTarget);
	return squelched;
}

// Ignore events for one microtask only.
async function squelchEventsForMicrotask(eventTarget: EventTarget | null) {
	isSquelchingEventTargets.add(eventTarget);
	// Need to pause for just one microtask.
	await nextMicrotask();
	isSquelchingEventTargets.delete(eventTarget);
}
