import { CategoryType, IProduct } from '../../types';
import { categoryMapping, CDN_URL } from '../../utils/constants';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Component<IProduct> {
	protected _index: HTMLElement;
	protected _button: HTMLButtonElement;

	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _id: string;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);

		this._index = this.container.querySelector('.basket__item-index');

		this._button = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(id: string) {
		this._id = id;
	}

	get id() {
		return this._id;
	}

	set title(title: string) {
		this._title.textContent = title;
	}

	handlePrice(value: number | null) {
		if (typeof value === 'number') {
			return value + ' синапсов';
		} else {
			return 'Бесценно';
		}
	}

	set price(price: number) {
		this._price.textContent = this.handlePrice(price);
		if (this._button && !price) {
			this._button.disabled = true;
		}
	}

	set index(value: number) {
		this._index.textContent = String(value);
	}
}

export class CardCatalog extends CardBasket {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this._category = this.container.querySelector('.card__category');
		this._image = this.container.querySelector('.card__image');
	}

	set category(category: CategoryType) {
		this._category.textContent = category;
		this._category.classList.add(categoryMapping[category]);
	}

	set image(image: string) {
		this._image.src = CDN_URL + image;
	}

	set selected(value: boolean) {
		if (value) {
			this._button.disabled = value;
		}
	}
}

export class CardPreview extends CardCatalog {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this._description = this.container.querySelector('.card__text');
	}

	set description(description: string) {
		this._description.textContent = description;
	}
}
