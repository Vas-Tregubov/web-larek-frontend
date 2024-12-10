import { EventEmitter } from '../components/base/events';

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

export interface IUserData {
	payment: string;
	address: string;
	email: string;
	phone: string;
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
