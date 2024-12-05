import { EventEmitter } from '../components/base/events';

// Интерфейс карточки товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

// Интерфейс заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: { id: string; quantity: number }[];
}

// Интерфейс для базового класса Modal
export interface IModal {
	modal: HTMLElement;
	events: EventEmitter;

	open(): void;
	close(): void;
	setEventListeners(): void;
}

// Интерфейс для класса Card
// export interface ICard {
// 	element: HTMLElement;
// 	events: IEvents;

// 	render(productData: IProduct): HTMLElement;
// 	update(productData: IProduct): void;
// 	openProductModal(): void;
// }
