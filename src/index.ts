import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CardsData } from './components/CardsData';
import { UserData } from './components/UserData';
import { IApi } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { ApiCardResponse, ApiOrderResponse, IOrder, IProduct } from './types';
import { CardCatalog, CardPreview, CardBasket } from './components/View/Card';
import { Page } from './components/View/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/View/Basket';
import { Modal } from './components/common/Modal';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const events = new EventEmitter();

// Templates
const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Container
const modalContainer: HTMLElement = document.querySelector('#modal-container');

// Global containers
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Reusable components
const cardsData = new CardsData({}, events);
const userData = new UserData({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

// Fetching cards from the server
api
	.getCards()
	.then((result: ApiCardResponse) => {
		cardsData.cards = result.items;
		events.emit('cards:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

// Loading cards from the server
events.on('cards:loaded', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardInstant = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:change', card),
		});
		return cardInstant.render(card);
	});

	page.render({ catalog: cardsArray });
});

// Opening a card
events.on('preview:change', (data: { id: string }) => {
	const selectedProduct = cardsData.getCard(data.id);
	cardsData.setPreview(selectedProduct);
});

// Adding and removing items from the cart
events.on('card:change', (data: { id: string }) => {
	const changedProduct = cardsData.getCard(data.id);
	cardsData.toggleCardSelection(changedProduct);
});

// Displaying the opened card
events.on('preview:changed', (item: IProduct) => {
	page.counter = cardsData.getSelectedProducts().length;
	const product = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:change', item);
		},
	});
	modal.render({
		content: product.render(item),
	});
});

// Updating the cart
events.on('basket:changed', () => {
	page.counter = cardsData.getSelectedProducts().length;
	const cardBasketArray = cardsData.cards
		.filter((card) => card.selected)
		.map((card, index) => {
			const cardBasketInstant = new CardBasket(
				cloneTemplate(cardBasketTemplate),
				{
					onClick: () => {
						events.emit('card:change', card);
					},
				}
			);
			return cardBasketInstant.render({
				title: card.title,
				price: card.price,
				index: index + 1,
			});
		});
	basket.list = cardBasketArray;
	basket.total = cardsData.getTotalPrice();
});

// Displaying the cart
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Opening the order form
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Opening the contacts form
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// One of the input fields has changed
events.on('input:change', (data: { field: keyof IOrder; value: string }) => {
	userData.setUserOrder(data.field, data.value);
});

// The order validation state has changed
events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// The contacts validation state has changed
events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Sending the order
events.on('contacts:submit', () => {
	const order = {
		...userData.getUserData(),
		items: cardsData.getSelectedProducts().map((card) => card.id),
		total: cardsData.getTotalPrice(),
	};
	api
		.postOrder(order)
		.then((response) => {
			events.emit('order:success', response);
		})
		.catch((err) => {
			console.log(err);
		});
});

// Handling success
events.on('order:success', (response: ApiOrderResponse) => {
	modal.render({
		content: success.render({
			total: response.total,
		}),
	});
	cardsData.resetSelected();
});

// Locking page scrolling when a modal is open
events.on('modal:open', () => {
	page.locked = true;
});

// Unlocking page scrolling when a modal is closed
events.on('modal:close', () => {
	page.locked = false;
});
