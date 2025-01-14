export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: CategoryType;
	price: number | null;
	selected: boolean | undefined;
	index: number;
}

export type CategoryType =
	| 'другое'
	| 'софт-скил'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

export type CategoryMapping = {
	[Key in CategoryType]: string;
};

export interface ICardsData {
	cards: IProduct[];
	preview: string | null;
	setPreview(card: IProduct): void;
  getCard(cardId: string): IProduct | undefined;
  toggleSelected(card: IProduct): void;
	getAddedProducts(): IProduct[];
  getTotalPrice(): number;
	resetSelected(): void
}

export interface IUserData {
	payment: string;
	address: string;
	email: string;
	phone: string;
	setUserOrder(field: keyof IOrder, value: string): void;
	getUserData(): void;
  validateOrder(): void;
  validateContacts(): void
}

export type TUserOrder = Pick<IUserData, 'payment' | 'address'>;
export type TUserContacts = Pick<IUserData, 'email' | 'phone'>;

export interface ICatalog {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IOrder {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
	total: number;
}

export type ApiCardResponse = {
	items: IProduct[];
};

export type ApiOrderResponse = {
	id: string;
	total: number;
};
