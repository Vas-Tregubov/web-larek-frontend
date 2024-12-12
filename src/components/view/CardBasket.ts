import { IProduct, IActions } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class CardBasket extends Component<IProduct> {
	protected index: HTMLElement;
	protected button: HTMLButtonElement;

	protected title: HTMLElement;
	protected price: HTMLElement;
	protected id: string;

	constructor(
		protected container: HTMLElement,
		actions?: IActions
	) {
		super(container);

		this.title = ensureElement<HTMLElement>('.card__title', container);
		this.price = ensureElement<HTMLElement>('.card__price', container);
		this.index = ensureElement<HTMLElement>('.basket__item-index', container);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		if (actions.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set setId(id: string) {
		this.id = id;
	}

	get getId() {
		return this.id;
	}

	set setTitle(title: string) {
		this.title.textContent = title;
	}

	formatPrice(value: number | null) {
		if (typeof value === 'number') {
			return value + ' синапсов';
		} else {
			return 'Бесценно';
		}
	}

	set setPrice(price: number) {
		this.price.textContent = this.formatPrice(price);
		if (this.button && !price) {
			this.button.disabled = true;
		}
	}

	set setIndex(value: number) {
		this.index.textContent = String(value);
	}
}
