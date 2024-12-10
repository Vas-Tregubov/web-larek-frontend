import { IEvents } from '../base/events';
import { IUserData } from '../../types';
import { FormCommon } from './FormCommon';

export class Order extends FormCommon<Partial<IUserData>> {
	protected cardButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;
	protected address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.cardButton = this.container.querySelector(
			'[name="card"]'
		) as HTMLButtonElement;
		this.cashButton = this.container.querySelector(
			'[name="cash"]'
		) as HTMLButtonElement;
		this.address = this.container.querySelector(
			'[name="address"]'
		) as HTMLInputElement;

		if (this.cashButton) {
			this.cashButton.addEventListener('click', () => {
				this.cashButton.classList.add('button_alt-active');
				this.cardButton.classList.remove('button_alt-active');
				this.onChangeInput('payment', 'cash');
			});
		}
		if (this.cardButton) {
			this.cardButton.addEventListener('click', () => {
				this.cardButton.classList.add('button_alt-active');
				this.cashButton.classList.remove('button_alt-active');
				this.onChangeInput('payment', 'card');
			});
		}
	}
}
