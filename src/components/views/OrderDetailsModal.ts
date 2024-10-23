import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';
import { IOrder } from '../../types';
import { OrderModel } from '../models/OrderModel';

export class OrderDetailsModal extends Modal<IOrder> {
	public modal: HTMLElement;
	public events: EventEmitter;
	private onSubmit: (orderData: IOrder) => void;

	private payment: string;
	private address: string;
	private email: string;
	private phone: string;
	private currentStep: number;

	constructor(
		selector: string,
		events: EventEmitter,
		onSubmit: (orderData: IOrder) => void,
		private orderModel: OrderModel
	) {
		super(selector, events);

		this.onSubmit = onSubmit;
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.currentStep = 1;

		this.setEventListeners();
	}

	open(orderData: IOrder): void {
		// Сбрасываем поля, если было открыто ранее
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.currentStep = 1;

		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;
		modalContent.innerHTML = '';

		const template = document.getElementById('order') as HTMLTemplateElement;
		const templateContent = template.content.cloneNode(true) as HTMLElement;

		modalContent.appendChild(templateContent);

		this.modal.classList.add('modal_active');

		this.setupEventListeners();
	}

	close(): void {
		super.close();
		this.payment = '';
		this.address = '';
		this.email = '';
		this.phone = '';
		this.currentStep = 1;
	}

	private setupEventListeners(): void {
		const nextButton = this.modal.querySelector(
			'.order__button'
		) as HTMLElement;
		const closeButton = this.modal.querySelector(
			'.modal__close'
		) as HTMLElement;

		// Установка обработчика для кнопки "Закрыть"
		if (closeButton) {
			closeButton.addEventListener('click', () => this.close());
		}

		// Установка обработчиков для текущего шага
		if (this.currentStep === 1) {
			this.setupStep1Listeners(nextButton);
		} else if (this.currentStep === 2) {
			this.setupStep2Listeners(nextButton);
		}
	}

	private setupStep1Listeners(nextButton: HTMLElement): void {
		// Обработчик для кнопки "Далее" на первом шаге
		if (nextButton) {
			nextButton.addEventListener('click', () => {
				if (this.validateStep1()) {
					this.goToNextStep();
				}
			});
		}

		// Обработчики для выбора способа оплаты
		const onlineButton = this.modal.querySelector(
			'button[name="card"]'
		) as HTMLElement;
		const cashButton = this.modal.querySelector(
			'button[name="cash"]'
		) as HTMLElement;

		if (onlineButton) {
			onlineButton.addEventListener('click', () => {
				this.payment = 'online';
				this.updatePaymentMethodUI();
			});
		}

		if (cashButton) {
			cashButton.addEventListener('click', () => {
				this.payment = 'cash';
				this.updatePaymentMethodUI();
			});
		}
	}

	private setupStep2Listeners(nextButton: HTMLElement): void {
		if (nextButton) {
			nextButton.addEventListener('click', () => {
				if (this.validateStep2()) {
					const orderDetails = this.orderModel.getOrderDetails();
					this.submitOrder(orderDetails.items, orderDetails.total);
				}
			});
		}
	}

	private validateStep1(): boolean {
		const addressInput = this.modal.querySelector(
			'input[name="address"]'
		) as HTMLInputElement;
		const paymentMethodSelected = this.payment !== '';
		const errorSpan = this.modal.querySelector('.form__errors') as HTMLElement;
		const nextButton = this.modal.querySelector(
			'.modal__actions button'
		) as HTMLButtonElement; // Кнопка "Далее"

		// Сбрасываем предыдущие сообщения об ошибках
		errorSpan.textContent = '';

		if (
			addressInput &&
			addressInput.value.trim() === '' &&
			!paymentMethodSelected
		) {
			errorSpan.textContent =
				'Пожалуйста, укажите адрес доставки и выберите способ оплаты.';
			nextButton.disabled = true;
			return false;
		}

		if (addressInput && addressInput.value.trim() === '') {
			errorSpan.textContent = 'Пожалуйста, укажите адрес доставки.';
			nextButton.disabled = true;
			return false;
		}

		if (!paymentMethodSelected) {
			errorSpan.textContent = 'Пожалуйста, выберите способ оплаты.';
			nextButton.disabled = true;
			return false;
		}

		// Если все проверки пройдены, активируем кнопку "Далее"
		nextButton.disabled = false;
		return true;
	}

	private validateStep2(): boolean {
		const emailInput = this.modal.querySelector(
			'input[name="email"]'
		) as HTMLInputElement;
		const phoneInput = this.modal.querySelector(
			'input[name="phone"]'
		) as HTMLInputElement;
		const errorSpan = this.modal.querySelector('.form__errors') as HTMLElement;
		const payButton = this.modal.querySelector(
			'.modal__actions button'
		) as HTMLButtonElement; // Кнопка "Оплатить"

		// Шаблоны регулярных выражений
		const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phonePattern = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;

		// Сбрасываем ошибки
		errorSpan.textContent = '';

		// Проверка email
		if (
			!emailInput.value.trim() ||
			!emailPattern.test(emailInput.value.trim())
		) {
			errorSpan.textContent += 'Введите корректный email. ';
		}

		// Проверка телефона
		if (
			!phoneInput.value.trim() ||
			!phonePattern.test(phoneInput.value.trim())
		) {
			errorSpan.textContent += 'Введите корректный телефон. ';
		}

		if (errorSpan.textContent) {
			payButton.disabled = true;
			return false;
		} else {
			// Если проверки прошли успешно, активируем кнопку "Оплатить"
			payButton.disabled = false;
			return true;
		}
	}

	submitOrder(
		cartItems: { id: string; quantity: number }[],
		total: number
	): void {
		const isStep1Valid = this.validateStep1();
		const isStep2Valid = this.validateStep2();

		if (!isStep1Valid || !isStep2Valid) {
			return;
		}

		// Формируем объект заказа
		const orderData: IOrder = {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
			total: total,
			items: cartItems,
		};

		this.onSubmit(orderData);
	}

	private goToNextStep(): void {
		const firstStep = this.modal.querySelector('.order') as HTMLElement;
		firstStep.style.display = 'none';

		const secondStepTemplate = document.getElementById(
			'contacts'
		) as HTMLTemplateElement;
		const secondStepContent = secondStepTemplate.content.cloneNode(
			true
		) as HTMLElement;
		const modalContent = this.modal.querySelector(
			'.modal__content'
		) as HTMLElement;

		modalContent.innerHTML = '';
		modalContent.appendChild(secondStepContent);

		this.currentStep = 2;

		this.setupEventListeners();
	}

	private updatePaymentMethodUI(): void {
		const onlineButton = this.modal.querySelector(
			'button[name="card"]'
		) as HTMLElement;
		const cashButton = this.modal.querySelector(
			'button[name="cash"]'
		) as HTMLElement;
		const nextButton = this.modal.querySelector(
			'.order__button'
		) as HTMLButtonElement;

		// Проверяем, какой способ оплаты выбран
		if (this.payment === 'online') {
			onlineButton.classList.add('selected');
			cashButton.classList.remove('selected');
			nextButton.disabled = false;
		} else if (this.payment === 'cash') {
			cashButton.classList.add('selected');
			onlineButton.classList.remove('selected');
			nextButton.disabled = false;
		} else {
			// Если способ оплаты не выбран
			onlineButton.classList.remove('selected');
			cashButton.classList.remove('selected');
			nextButton.disabled = true;
		}
	}
}
