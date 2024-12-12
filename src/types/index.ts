import { EventEmitter } from '../components/base/events';

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
	selected: boolean | undefined;
	index: number;
}

export const categoryMap = {
	другое: 'card__category_other',
	'софт-скил': 'card__category_soft',
	дополнительное: 'card__category_additional',
	кнопка: 'card__category_button',
	'хард-скил': 'card__category_hard',
} as const;

export type TProductCategory = keyof typeof categoryMap;

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export interface IModal {
	content: HTMLElement;
}

export interface IForm {
	valid: boolean;
	errors: string[];
}

export interface ICatalog {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IBasket {
	items: HTMLElement[];
	price: number;
}

export interface ISuccess {
	total: number;
}

export interface IUserData {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IProductList {
	products: IProduct[];
	preview: string | null;
}

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
