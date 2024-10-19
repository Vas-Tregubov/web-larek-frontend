import { IOrder } from '../../types';
import { EventEmitter } from '../base/events';

export class OrderModel {
	private payment: string;
	private email: string;
	private phone: string;
	private address: string;
	private total: number;
	private items: { id: string; quantity: number }[];
	private events: EventEmitter;

	constructor(order: IOrder, events: EventEmitter) {
		this.payment = order.payment;
		this.email = order.email;
		this.phone = order.phone;
		this.address = order.address;
		this.total = order.total;
		this.items = order.items;
		this.events = events;
	}

	public getOrderDetails(): IOrder {
		return {
			payment: this.payment,
			email: this.email,
			phone: this.phone,
			address: this.address,
			total: this.total,
			items: this.items,
		};
	}

	public updateOrderDetails(update: Partial<IOrder>): void {
		Object.assign(this, update);

		// Генерируем событие после обновления данных заказа
		this.events.emit('orderUpdated', this.getOrderDetails());
	}

	public validateOrder(): boolean {
		// Проверяем наличие всех полей и что общая сумма не отрицательная
		if (
			!this.payment ||
			!this.email ||
			!this.phone ||
			!this.address ||
			!this.items.length ||
			this.total < 0
		) {
			return false;
		}
		return true;
	}

	public calculateTotal(products: { id: string; price: number }[]): void {
		let sum = 0;
		this.items.forEach(({ id, quantity }) => {
			const product = products.find((p) => p.id === id);
			if (product) {
				sum += product.price * quantity;
			}
		});
		this.total = sum;
	}
}
