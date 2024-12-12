import { CardBasket } from './CardBasket';
import { ensureElement } from '../../utils/utils';
import { CDN_URL } from '../../utils/constants';
import { categoryMap, TProductCategory, IActions } from '../../types/index';

export class CardList extends CardBasket {
	protected category: HTMLElement;
	protected image: HTMLImageElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container, actions);

		this.category = ensureElement<HTMLElement>('.card__category', container);
		this.image = ensureElement<HTMLImageElement>('.card__image', container);
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
