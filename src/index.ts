import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { CardsData } from './components/CardsData';
import { BasketData } from './components/BasketData';
import { UserData } from './components/UserData';
import { IApi } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { ApiCardResponse, ApiOrderResponse, IOrder, IProduct } from './types';
import { CardList, CardPreview, CardBasket } from './components/View/Card';
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

// Шаблоны
const cardCatalogTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
const cardPreviewTemplate: HTMLTemplateElement =
	document.querySelector('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Основной контейнер модалки
const modalContainer: HTMLElement = document.querySelector('#modal-container');

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events);

// Компоненты
const cardsData = new CardsData({}, events);
const basketData = new BasketData({}, events);
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

// Загружаем карточки с сервера
api
	.getCards()
	.then((result: ApiCardResponse) => {
		cardsData.cards = result.items;
		events.emit('cards:loaded');
	})
	.catch((err) => {
		console.error(err);
	});

// Отображаем карточки
events.on('cards:loaded', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardInstant = new CardList(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:change', card),
		});
		return cardInstant.render(card);
	});

	page.render({ catalog: cardsArray });
});

// Открываем карточку
events.on('preview:change', (data: { id: string }) => {
	const selectedProduct = cardsData.getCard(data.id);
	cardsData.setPreview(selectedProduct);
});

// Добавляем и удаляем карточку из корзины
events.on('card:change', (data: { id: string }) => {
	const changedProduct = cardsData.getCard(data.id);
	cardsData.toggleCardSelection(changedProduct);
	basketData.selectedProducts = cardsData.cards.filter((card) => card.selected);
	events.emit('basket:changed');

	if (changedProduct.selected) {
		modal.close();
	}
});

// Отображаем открытую карточку
events.on('preview:changed', (item: IProduct) => {
	page.counter = basketData.getSelectedProducts().length;
	const product = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('card:change', item);
		},
	});
	modal.render({
		content: product.render(item),
	});
});

// Обновляем карточку корзины
events.on('basket:changed', () => {
	page.counter = basketData.getSelectedProducts().length;
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
	basket.total = basketData.getTotalPrice();

	if (basketData.getSelectedProducts().length === 0) {
		modal.close();
		return;
	}
});

// Рендерим карточку
events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

// Открываем форму заказа
events.on('order:open', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открываем форму контактов
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

// Одно из полей ввода изменилось
events.on('input:change', (data: { field: keyof IOrder; value: string }) => {
	userData.setUserOrder(data.field, data.value);
});

// Статус валидации полей заказа изменился
events.on('orderFormErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});

// Статус валидации полей контактов изменился
events.on('contactsFormErrors:change', (errors: Partial<IOrder>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join(', ');
});

// Отправляем заказ на сервер
events.on('contacts:submit', () => {
	const order = {
		...userData.getUserData(),
		items: basketData.getSelectedProducts().map((card) => card.id),
		total: basketData.getTotalPrice(),
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

// Обрабатываем успешное оформление
events.on('order:success', (response: ApiOrderResponse) => {
	modal.render({
		content: success.render({
			total: response.total,
		}),
	});
	setTimeout(() => {
		modal.close();
	}, 5000);
	basketData.resetSelected();
});

// Блокируем прокрутку страницы, когда открыто модальное окно
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокируем прокрутку страницы, когда модальное окно закрыто
events.on('modal:close', () => {
	page.locked = false;
});
