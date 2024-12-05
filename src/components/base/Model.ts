import { IEvents } from './events';

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	triggerEvent(eventName: string, data?: object) {
		this.events.emit(eventName, data ?? {});
	}
}
