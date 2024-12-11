import { CardList } from './CardList';
import { ensureElement } from '../../utils/utils';

export class CardPreview extends CardList {
	protected description: HTMLElement;

	constructor(container: HTMLElement, onClick?: (event: MouseEvent) => void) {
		super(container, onClick);
		this.description = ensureElement<HTMLElement>('.card__text', container);
	}

	set setDescription(description: string) {
		this.description.textContent = description;
	}
}
