import { CardList } from './CardList';
import { ensureElement } from '../../utils/utils';
import { IActions } from '../../types';

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
