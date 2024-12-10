import { EventEmitter } from '../components/base/events';

// Интерфейс карточки товара
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	selected: boolean | undefined;
	index: number;
}

// Интерфейс заказа
export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

// Интерфейс для базового класса Modal
export interface IModal {
	content: HTMLElement;
}

// Интерфейс апи
export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type ApiCardResponse = {
	items: IProduct[];
};

export type ApiOrderResponse = {
	id: string;
	total: number;
};
