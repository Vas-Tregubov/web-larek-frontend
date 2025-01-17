import { ICatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Page extends Component<ICatalog> {
	protected basketCounter: HTMLElement;
	protected gallery: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected wrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;
		this.basketCounter = ensureElement<HTMLButtonElement>(
			'.header__basket-counter',
			container
		);
		this.gallery = ensureElement<HTMLElement>('.gallery', container);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

		this.basketButton.addEventListener('click', () => {
			this.events.emit('basket:open', {});
		});
	}

	set counter(counter: number) {
		this.basketCounter.textContent = String(counter);
	}

	set catalog(items: HTMLElement[]) {
		this.gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this.wrapper.classList.add('page__wrapper_locked');
		} else {
			this.wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
