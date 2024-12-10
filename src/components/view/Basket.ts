import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IBasket } from '../../types';

export class Basket extends Component<IBasket> {
	protected items: HTMLElement;
	protected price: HTMLElement;
	protected button: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this.items = ensureElement<HTMLElement>('.basket__list', container);
		this.price = ensureElement<HTMLElement>('.basket__price', container);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this.button.addEventListener('click', () => {
			this.events.emit('order:open', {});
		});
	}

	set total(value: number) {
		this.price.textContent = value + ' синапсов';
		this.toggleElementState(this.button, value === 0);
	}

	set list(items: HTMLElement[]) {
		this.items.replaceChildren(...items);
	}
}
