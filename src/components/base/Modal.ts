import { EventEmitter } from './events';

export abstract class Modal<T> {
	protected modal: HTMLElement;
	protected events: EventEmitter;

	constructor(selector: string, events: EventEmitter) {
		this.modal = document.querySelector(selector) as HTMLElement;
		this.events = events;

		this.setEventListeners();
	}

	abstract open(data: T | T[]): void; //Оставим реализацию открытия классам-наследникам

	close(): void {
		this.modal.classList.remove('modal_active');
	}

	setEventListeners(): void {
		const closeButton = this.modal.querySelector(
			'.modal__close'
		) as HTMLElement;
		closeButton.addEventListener('click', () => this.close());

		this.modal.addEventListener('click', (event) => {
			if (event.target === this.modal) {
				this.close();
			}
		});

		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				this.close();
			}
		});
	}
}
