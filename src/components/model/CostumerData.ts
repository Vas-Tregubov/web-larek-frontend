import { IOrder } from '../../types/index';
import { Model } from '../base/Model';

export class CostumerData extends Model<IOrder> {
	protected payment: string = '';
	protected address: string = '';
	protected email: string = '';
	protected phone: string = '';

	validationErrors: Partial<Record<keyof IOrder, string>> = {};

	setOrder(field: keyof IOrder, value: string) {
		(this as any)[field] = value;

		if (this.validateContactDetails()) {
			this.events.emit('contacts:ready', this.getOrderDetails());
		}

		if (this.validateOrderDetails()) {
			this.events.emit('order:ready', this.getOrderDetails());
		}
	}

	getOrderDetails(): {
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

	validateOrderDetails(): boolean {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		if (!this.address) {
			errors.address = 'Address is required';
		}
		if (!this.payment) {
			errors.payment = 'Payment method is required';
		}

		this.validationErrors = errors;
		this.events.emit('orderFormErrors:change', this.validationErrors);

		return Object.keys(errors).length === 0;
	}

	validateContactDetails(): boolean {
		const errors: Partial<Record<keyof IOrder, string>> = {};

		if (!this.email) {
			errors.email = 'Email is required';
		}
		if (!this.phone) {
			errors.phone = 'Phone number is required';
		}

		this.validationErrors = errors;
		this.events.emit('contactsFormErrors:change', this.validationErrors);

		return Object.keys(errors).length === 0;
	}
}
