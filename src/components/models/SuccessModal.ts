import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';
import { IOrder } from '../../types';

export class SuccessModal extends Modal<IOrder> {
	public modal: HTMLElement;
	public events: EventEmitter;
	public amount: number;

	constructor(selector: string, events: EventEmitter) {
		super(selector, events);
		this.modal = document.querySelector(selector) as HTMLElement;
		this.events = events;
		this.amount = 0;
		this.setEventListeners();
	}

	open(order: IOrder): void {
		this.amount = order.total;

		const amountElement = this.modal.querySelector(
			'.order-success__description'
		);
		if (amountElement) {
			amountElement.textContent = `Списано ${this.amount} синапсов`;
		}

		// Устанавливаем слушатель для кнопки "За новыми покупками!"
		const returnButton = this.modal.querySelector('.order-success__close');
		if (returnButton) {
			returnButton.addEventListener('click', () => {
				this.close();
				this.onReturnHome();
			});
		}

		this.modal.classList.add('modal_active');
	}

	close(): void {
		super.close();
		this.amount = 0;
		const amountElement = this.modal.querySelector(
			'.order-success__description'
		);
		if (amountElement) {
			amountElement.textContent = `Списано 0 синапсов`;
		}
	}

	private setupEventListeners(): void {
		const button = this.modal.querySelector('.order-success__close');
		if (button) {
			button.addEventListener('click', () => {
				this.onReturnHome();
			});
		}
	}

	private onReturnHome(): void {
		this.close();
		window.location.href = '/';
	}
}
