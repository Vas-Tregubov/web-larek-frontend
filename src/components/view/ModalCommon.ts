import { IEvents } from '../base/events';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';
import { IModal } from '../../types';

export class ModalCommon extends Component<IModal> {
	protected modalContent: HTMLElement;
	protected closeButtonElement: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.modalContent = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);
		this.closeButtonElement = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);

		this.closeButtonElement.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.modalContent.addEventListener('click', (evt) => evt.stopPropagation());
		this.onEscapeKey = this.onEscapeKey.bind(this);
	}

	set content(value: HTMLElement) {
		this.modalContent.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
		document.addEventListener('keyup', this.onEscapeKey);
	}

	close() {
		this.container.classList.remove('modal__active');
		document.removeEventListener('keyup', this.onEscapeKey);
		this.events.emit('modal:close');
	}

	onEscapeKey(evt: KeyboardEvent) {
		if (
			evt.key === 'Escape' &&
			this.container.classList.contains('modal_active')
		) {
			this.close();
		}
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
