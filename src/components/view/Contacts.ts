import { IEvents } from '../base/events';
import { IUserData } from '../../types';
import { FormCommon } from './FormCommon';

export class Contacts extends FormCommon<Partial<IUserData>> {
	protected email: HTMLInputElement;
	protected phone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.email = this.container.querySelector(
			'[name="email"]'
		) as HTMLInputElement;
		this.phone = this.container.querySelector(
			'[name="phone"]'
		) as HTMLInputElement;
	}
}
