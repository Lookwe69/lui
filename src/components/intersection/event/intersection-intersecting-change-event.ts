import { StateEvent } from '../../../internal/event/state-event';

export class IntersectionIntersectingChangeEvent extends StateEvent<{
	oldSate: boolean | undefined;
	newState: boolean;
}> {
	get oldSate() {
		return this.state.oldSate;
	}
	get newState() {
		return this.state.newState;
	}
}
