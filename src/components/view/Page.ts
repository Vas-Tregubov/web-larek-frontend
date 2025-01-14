import { ICatalog } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

export class Page extends Component<ICatalog> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.events = events;
		this._counter = ensureElement<HTMLButtonElement>(
			'.header__basket-counter',
			container
		);
		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._basket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open', {});
		});
	}

	set counter(counter: number) {
		this._counter.textContent = String(counter);
	}

	set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
