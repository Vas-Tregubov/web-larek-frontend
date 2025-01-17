import { TUserOrder } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class Order extends Form<TUserOrder> {
	protected card: HTMLButtonElement;
	protected cash: HTMLButtonElement;
	protected address: HTMLInputElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this.card = this.container.elements.namedItem('card') as HTMLButtonElement;
		this.cash = this.container.elements.namedItem('cash') as HTMLButtonElement;

		this.address = this.container.elements.namedItem(
			'address'
		) as HTMLInputElement;

		if (this.cash) {
			this.cash.addEventListener('click', () => {
				this.cash.classList.add('button_alt-active');
				this.card.classList.remove('button_alt-active');
				this.onInputChange('payment', 'cash');
			});
		}
		if (this.card) {
			this.card.addEventListener('click', () => {
				this.card.classList.add('button_alt-active');
				this.cash.classList.remove('button_alt-active');
				this.onInputChange('payment', 'card');
			});
		}
	}
}
