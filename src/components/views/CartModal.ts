import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';
import { IOrder } from '../../types';
import { ProductModel } from '../models/ProductModel';
import { IProduct } from '../../types';

export class CartModal extends Modal<IOrder> {
	private onCheckout: (cartData: IOrder[]) => void;
	private items: { id: string; quantity: number }[] = [];
	private total: number = 0;
	private products: ProductModel[];

	constructor(
		selector: string,
		events: EventEmitter,
		onCheckout: (cartData: IOrder[]) => void,
		products: IProduct[]
	) {
		super(selector, events);
		this.onCheckout = onCheckout;
		this.setupEventListeners();
		this.products = products.map(
			(product) => new ProductModel(product, events)
		);
	}

	open(data: IOrder | IOrder[]): void {
		let cartItems: { id: string; quantity: number }[] = [];
		if (Array.isArray(data)) {
			data.forEach((order) => {
				cartItems = cartItems.concat(order.items);
			});
		} else {
			cartItems = data.items;
		}

		if (!cartItems || cartItems.length === 0) {
			console.error(
				'Корзина пуста или некорректные данные о товарах:',
				cartItems
			);
			return;
		}

		this.items = cartItems;

		this.calculateTotal();

		this.modal.classList.add('modal_active');
	}

	close(): void {
		super.close();
		this.items = [];
		this.total = 0;
	}

	private setupEventListeners(): void {
		const checkoutButton = document.querySelector('.basket__button');
		if (checkoutButton) {
			checkoutButton.addEventListener('click', () => {
				this.submitOrder();
			});
		}

		const deleteButtons = document.querySelectorAll('.basket__item-delete');
		deleteButtons.forEach((button, index) => {
			button.addEventListener('click', () => {
				this.removeItem(index);
			});
		});

		this.calculateTotal();
	}

	private removeItem(index: number): void {
		this.items.splice(index, 1);
		this.updateCartItems(this.items);
	}

	private calculateTotal(): void {
		this.total = this.items.reduce((acc, item) => {
			const product = this.products.find(
				(p) => p.getProductDetails().id === item.id
			);
			const itemPrice = product ? product.getProductDetails().price : 0;
			const itemTotalPrice = (itemPrice || 0) * item.quantity;
			return acc + itemTotalPrice;
		}, 0);

		const totalPriceElement = document.querySelector('.basket__price');
		if (totalPriceElement) {
			totalPriceElement.textContent = `${this.total} синапсов`;
		}
	}

	private updateCartItems(cartItems: { id: string; quantity: number }[]): void {
		this.items = cartItems;
	}

	private submitOrder(): void {
		if (this.items.length === 0) {
			return;
		}

		// Формируем массив товаров для передачи на оформление заказа
		const orderItems = this.items.map((item) => ({
			id: item.id,
			quantity: item.quantity,
		}));

		const modalContainer = document.getElementById('modal-container');
		if (modalContainer) {
			modalContainer.innerHTML = '';

			const orderTemplate = document.getElementById(
				'order'
			) as HTMLTemplateElement;
			const orderClone = orderTemplate.content.cloneNode(
				true
			) as DocumentFragment;

			// Добавляем обработчик события на кнопку "Далее"
			const orderButton = orderClone.querySelector(
				'.order__button'
			) as HTMLButtonElement;
			orderButton?.addEventListener('click', () => {
				const addressInput = orderClone.querySelector(
					'input[name="address"]'
				) as HTMLInputElement;
				const emailInput = orderClone.querySelector(
					'input[name="email"]'
				) as HTMLInputElement;
				const phoneInput = orderClone.querySelector(
					'input[name="phone"]'
				) as HTMLInputElement;
				const paymentInput = orderClone
					.querySelector('button.button_alt.active')
					?.getAttribute('name');

				// Проверяем, заполнены ли обязательные поля
				if (addressInput.value.trim() === '' || !paymentInput) {
					return;
				}

				const orderDetails: IOrder = {
					items: orderItems,
					address: addressInput.value,
					email: emailInput.value,
					phone: phoneInput.value,
					payment: paymentInput || '',
					total: this.total,
				};

				if (typeof this.onCheckout === 'function') {
					this.onCheckout([orderDetails]);
				}

				modalContainer.innerHTML = '';
			});

			modalContainer.appendChild(orderClone);
		}
	}

	private renderCartItems(): void {
		const cartItemsContainer = document.querySelector('.basket__list');
		const template = document.getElementById(
			'card-basket'
		) as HTMLTemplateElement;

		if (cartItemsContainer && template) {
			cartItemsContainer.innerHTML = '';

			this.items.forEach((item, index) => {
				const product = this.products.find(
					(p) => p.getProductDetails().id === item.id
				);
				if (product) {
					const productDetails = product.getProductDetails();

					const cartItemClone = template.content.cloneNode(
						true
					) as DocumentFragment;

					const cartItemElement = cartItemClone.querySelector(
						'.basket__item'
					) as HTMLElement;
					const itemIndex = cartItemElement.querySelector(
						'.basket__item-index'
					) as HTMLElement;
					const title = cartItemElement.querySelector(
						'.card__title'
					) as HTMLElement;
					const price = cartItemElement.querySelector(
						'.card__price'
					) as HTMLElement;
					const deleteButton = cartItemElement.querySelector(
						'.basket__item-delete'
					) as HTMLElement;

					if (itemIndex) itemIndex.textContent = (index + 1).toString();
					if (title) title.textContent = productDetails.title;
					if (price)
						price.textContent = `${
							productDetails.price ?? 'Цена не указана'
						} синапсов`;

					if (deleteButton) {
						deleteButton.dataset.id = item.id;
						deleteButton.addEventListener('click', () => {
							this.removeItem(Number(item.id));
						});
					}

					cartItemsContainer.appendChild(cartItemElement);
				}
			});

			this.calculateTotal();
		}
	}
}
