import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IModalData {
	content: HTMLElement;
}

export class Modal extends Component<IModalData> {
	protected contentElement: HTMLElement;
	protected closeButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.contentElement = ensureElement<HTMLElement>('.modal__content', container);
		this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.contentElement.addEventListener('click', (event) => event.stopPropagation());
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	set content(value: HTMLElement) {
		this.contentElement.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.container.classList.remove('modal_active');
		document.removeEventListener('keyup', this.handleEscUp);
		this.events.emit('modal:close');
	}

	handleEscUp(evt: KeyboardEvent) {
		if (
			evt.key === 'Escape' &&
			this.container.classList.contains('modal_active')
		) {
			this.close();
		}
	}

	render(data: IModalData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
