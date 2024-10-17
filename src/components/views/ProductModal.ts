import { IProduct } from '../../types';
import { Modal } from '../base/Modal';
import { EventEmitter } from '../base/events';

export class ProductModal extends Modal<IProduct> {
	private onAddToCart: (productId: string) => void;
	private productData: IProduct | null = null;

	constructor(
		selector: string,
		events: EventEmitter,
		onAddToCart: (productId: string) => void
	) {
		super(selector, events);
		this.onAddToCart = onAddToCart;
		this.setupEventListeners();
	}

	open(product: IProduct): void {
		if (!product) {
			console.error('Некорректные данные о товаре:', product);
			return;
		}
		this.setProductData(product);
		this.modal.classList.add('modal_active');
	}

	close(): void {
		super.close();
		this.productData = null;
	}

	public setProductData(product: IProduct): void {
		const imageElement = this.modal.querySelector(
			'.card__image'
		) as HTMLImageElement;
		if (imageElement) {
			imageElement.src = product.image;
			imageElement.alt = product.title;
		}

		const categoryElement = this.modal.querySelector(
			'.card__category'
		) as HTMLElement;
		if (categoryElement) {
			categoryElement.textContent = product.category;
		}

		const titleElement = this.modal.querySelector(
			'.card__title'
		) as HTMLElement;
		if (titleElement) {
			titleElement.textContent = product.title;
		}

		const descriptionElement = this.modal.querySelector(
			'.card__text'
		) as HTMLElement;
		if (descriptionElement) {
			descriptionElement.textContent = product.description;
		}

		const priceElement = this.modal.querySelector(
			'.card__price'
		) as HTMLElement;
		if (priceElement) {
			if (product.price != null) {
				priceElement.textContent =
					product.price > 0 ? `${product.price} синапсов` : 'бесценно';
			}
		}

		this.productData = product;
	}
	private setupEventListeners(): void {
		const addToCartButton = this.modal.querySelector('.button') as HTMLElement;

		if (addToCartButton) {
			addToCartButton.addEventListener('click', () => {
				if (this.productData) {
					this.onAddToCart(this.productData.id);
				}
			});
		}
	}
}

// const events = new EventEmitter();

// const productModal = new ProductModal(
// 	'#modal-container',
// 	events,
// 	(productId) => {
// 		console.log(`Товар с ID ${productId} добавлен в корзину`);
// 	}
// );

// const product = new ProductModel(
// 	{
// 		id: '90973ae5-285c-4b6f-a6d0-65d1d760b102',
// 		description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.',
// 		image: '/Mithosis.svg',
// 		title: 'Бэкенд-антистресс',
// 		category: 'другое',
// 		price: 1000,
// 	},
// 	events
// );

// productModal.open(product);
