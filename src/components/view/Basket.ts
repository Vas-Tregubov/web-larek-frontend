import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export interface IBasket {
	list: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this._list = ensureElement<HTMLElement>('.basket__list', container);
		this._total = ensureElement<HTMLElement>('.basket__price', container);
		this._button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		this._button.addEventListener('click', () => {
			this.events.emit('order:open', {});
		});
	}

	set total(value: number) {
		this._total.textContent = value + ' синапсов';
		this.setDisabled(this._button, value === 0);
	}

	set list(items: HTMLElement[]) {
		this._list.replaceChildren(...items);
	}
}
