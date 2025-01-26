/**
 * Base class for events that carry state information.
 */
export abstract class StateEvent<T = void> extends Event {
	protected state: T;

	constructor(eventType: string, state: T, eventInitDict?: EventInit) {
		super(eventType, eventInitDict);
		this.state = state;
	}
}
