import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { ICatalog } from '../../types';

export class CatalogPage extends Component<ICatalog> {
	protected counter: HTMLElement;
	protected catalog: HTMLElement;
	protected basket: HTMLButtonElement;
	protected wrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;

		this.counter = ensureElement<HTMLButtonElement>(
			'.header__basket-counter',
			container
		);
		this.catalog = ensureElement<HTMLElement>('.gallery', container);
		this.basket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

		this.basket.addEventListener('click', () => {
			this.events.emit('basket:open', {});
		});
	}

	set count(counter: number) {
		this.counter.textContent = String(counter);
	}

	set setCatalogItems(items: HTMLElement[]) {
		this.catalog.replaceChildren(...items);
	}

	set isContentLocked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
