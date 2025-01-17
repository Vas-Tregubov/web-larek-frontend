import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IBasket {
	list: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected basketList: HTMLElement;
	protected totalPrice: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this.basketList = ensureElement<HTMLElement>('.basket__list', container);
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('order:open', {});
		});
	}

	set total(value: number) {
		this.totalPrice.textContent = value + ' синапсов';
		this.setDisabled(this.basketButton, value === 0);
	}

	set list(items: HTMLElement[]) {
		this.basketList.replaceChildren(...items);
	}
}
