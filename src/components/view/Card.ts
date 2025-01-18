import { CategoryType, IProduct } from '../../types';
import { categoryMapping, CDN_URL } from '../../utils/constants';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class CardBasket extends Component<IProduct> {
	protected itemIndex: HTMLElement;
	protected cardButton: HTMLButtonElement;
	protected cardTitle: HTMLElement;
	protected cardPrice: HTMLElement;
	protected productId: string;

	constructor(protected container: HTMLElement, actions?: ICardActions) {
		super(container);

		this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this.cardPrice = ensureElement<HTMLElement>('.card__price', container);

		this.itemIndex = this.container.querySelector('.basket__item-index');

		this.cardButton = container.querySelector(`.card__button`);

		if (actions?.onClick) {
			if (this.cardButton) {
				console.log('Добавлен хендлер кнопке');
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				console.log('Добавлен хендлер контейнеру');
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(id: string) {
		this.productId = id;
	}

	get id() {
		return this.productId;
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	resolvePrice(value: number | null) {
		if (typeof value === 'number') {
			return value + ' синапсов';
		} else {
			return 'Бесценно';
		}
	}

	set price(price: number) {
		this.cardPrice.textContent = this.resolvePrice(price);
		if (this.cardButton && !price) {
			console.log(`Disabling button because price is ${price}`);
			this.cardButton.disabled = true;
		}
	}

	set index(value: number) {
		this.itemIndex.textContent = String(value);
	}
}

export class CardList extends CardBasket {
	protected cardCategory: HTMLElement;
	protected cardImage: HTMLImageElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);

		this.cardCategory = this.container.querySelector('.card__category');
		this.cardImage = this.container.querySelector('.card__image');

		console.log('CardCatalog initialized successfully');
	}

	set category(category: CategoryType) {
		this.cardCategory.textContent = category;
		this.cardCategory.classList.add(categoryMapping[category]);
	}

	set image(image: string) {
		this.cardImage.src = CDN_URL + image;
	}

	set selected(value: boolean) {
		if (value) {
			this.cardButton.disabled = value;
		}
	}
}

export class CardPreview extends CardList {
	protected cardText: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
		this.cardText = this.container.querySelector('.card__text');
		console.log('CardPreview initialized successfully');
	}

	set description(description: string) {
		this.cardText.textContent = description;
	}
}
