import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { TProductCategory, IProduct, categoryMap, IActions } from '../../types';
import { CDN_URL } from '../../utils/constants';

export class CardBasket extends Component<IProduct> {
	protected index: HTMLElement;
	protected button: HTMLButtonElement;

	protected title: HTMLElement;
	protected price: HTMLElement;
	protected id: string;

	constructor(protected container: HTMLElement, actions?: IActions) {
		super(container);

		this.title = ensureElement<HTMLElement>('.card__title', container);
		this.price = ensureElement<HTMLElement>('.card__price', container);
		this.index = this.container.querySelector('.basket__item-index')!;
		this.button = container.querySelector(`.card__button`)!;

		if (actions?.onClick) {
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

export class CardList extends CardBasket {
	public category: HTMLElement;
	protected image: HTMLImageElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container, actions);

		this.category = this.container.querySelector('.card__category')!;
		this.image = this.container.querySelector('.card__image')!;
	}

	set setCategory(category: TProductCategory) {
		this.category.textContent = category;
		this.category.classList.add(categoryMap[category]);
	}

	set setImage(image: string) {
		this.image.src = CDN_URL + image;
	}

	set setSelected(value: boolean) {
		if (value) {
			this.button.disabled = value;
		}
	}
}

export class CardPreview extends CardList {
	protected description: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container, actions);
		this.description = ensureElement<HTMLElement>('.card__text', container);
	}

	set setDescription(description: string) {
		this.description.textContent = description;
	}
}
