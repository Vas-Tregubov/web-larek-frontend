import './scss/styles.scss';

import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';

import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, settings } from './utils/constants';

import {
	ApiCardResponse,
	ApiOrderResponse,
	IOrder,
	IProduct,
	IApi,
} from './types';

import { AppApi } from './components/presenter/AppApi';

import { CostumerData } from './components/model/CostumerData';
import { ProductListData } from './components/model/ProductListData';

import { Basket } from './components/view/Basket';
import { CardBasket, CardList, CardPreview } from './components/view/Card';
import { CatalogPage } from './components/view/CatalogPage';
import { Contacts } from './components/view/Contacts';
import { ModalCommon } from './components/view/ModalCommon';
import { Order } from './components/view/Order';
import { Success } from './components/view/Success';

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);
const events = new EventEmitter();

//Templates

const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Containers

const modalContainer: HTMLElement = document.querySelector('#modal-container');
const page = new CatalogPage(document.body, events);
const modal = new ModalCommon(modalContainer, events);

//Components

const costumerData = new CostumerData({}, events);
const productListData = new ProductListData({}, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close');
		modal.close();
	},
});

//Get cards from server

api
	.getCards()
	.then((result: ApiCardResponse) => {
		productListData.productList = result.items;
		events.emit('cards:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

//Load cards

events.on('cards:loaded', () => {
	if (productListData.productList && productListData.productList.length > 0) {
		const productsArray = productListData.productList.map((card) => {
			const cardInstant = new CardList(cloneTemplate(cardCatalogTemplate), {
				onClick: () => events.emit('preview:change', card),
			});
			return cardInstant.render(card);
		});

		page.render({ setCatalogItems: productsArray });
	} else {
		console.log('Нет карточек для отображения');
	}
});

//Open card

events.on('preview:change', (data: { id: string }) => {
	const selectedProduct = productListData.findProductById(data.id);
	productListData.toggleProductSelection(selectedProduct);
});

//Add and delete product from basket

events.on('card:change', (data: { id: string }) => {
	const changedProduct = productListData.findProductById(data.id);
	productListData.toggleProductSelection(changedProduct);
});

//Render the product

events.on('preview:changed', (item: IProduct) => {
	page.count = productListData.getSelectedProducts().length;
	const product = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:change', item);
		},
	});
	modal.render({
		content: product.render(item),
	});
});

//Update basket

events.on('basket:changed', () => {
	page.count = productListData.getSelectedProducts().length;
	const cardBasketArray = productListData.productList
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
	basket.total = productListData.calculateTotalPrice();
});

//Render the basket

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

//Order form

events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

//Contacts form

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

//Input change

events.on('input:change', (data: { field: keyof IOrder; value: string }) => {
	costumerData.setOrder(data.field, data.value);
});

//Validation change

events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

//Make order

events.on('contacts:submit', () => {
	const order = {
		...costumerData.getOrderDetails(),
		items: productListData.getSelectedProducts().map((card) => card.id),
		total: productListData.calculateTotalPrice(),
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

//Success

events.on('order:success', (response: ApiOrderResponse) => {
	modal.render({
		content: success.render({
			total: response.total,
		}),
	});
	productListData.clearSelectedProducts();
});

//Modals

events.on('modal:open', () => {
	page.isContentLocked = true;
});

events.on('modal:close', () => {
	page.isContentLocked = false;
});
