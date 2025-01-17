import { IOrder } from '../types/index';
import { Model } from './base/Model';

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export class UserData extends Model<IOrder> {
	protected payment: string;
	protected address: string;
	protected email: string;
	protected phone: string;

	formErrors: FormErrors = {};

	setUserOrder(field: keyof IOrder, value: string) {
		(this as any)[field] = value;

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this);
		}
		if (this.validateOrder()) {
			this.events.emit('order:ready', this);
		}
	}

	getUserData(): {
		payment: string;
		address: string;
		email: string;
		phone: string;
	} {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validateContacts() {
		const errors: typeof this.formErrors = {};

		// Валидация email
		if (!this.email) {
			errors.email = 'Необходимо указать email ';
		} else if (!this.isValidEmail(this.email)) {
			errors.email = 'Некорректный email ';
		}

		// Валидация телефона
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон ';
		} else if (!this.isValidPhone(this.phone)) {
			errors.phone = 'Некорректный номер телефона ';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Функция для проверки email
	private isValidEmail(email: string): boolean {
		const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		return emailPattern.test(email);
	}

	// Функция для проверки телефона
	private isValidPhone(phone: string): boolean {
		const phonePattern =
			/^(?:\+7|8)\s?\(?\d{3}\)?\s?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}$/;
		return phonePattern.test(phone);
	}
}
