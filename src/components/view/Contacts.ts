import { TUserContacts } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Contacts extends Form<TUserContacts> {
	protected _email: HTMLInputElement;
	protected _phone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._email = this.container.elements.namedItem(
			'email'
		) as HTMLInputElement;
		this._phone = this.container.elements.namedItem(
			'phone'
		) as HTMLInputElement;
	}
}
