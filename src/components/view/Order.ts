import { TUserOrder } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Order extends Form<TUserOrder> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this._cash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		this._address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		if (this._cash) {
			this._cash.addEventListener('click', () => {
				this._cash.classList.add('button_alt-active');
				this._card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this._card) {
			this._card.addEventListener('click', () => {
				this._card.classList.add('button_alt-active');
				this._cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}
}
