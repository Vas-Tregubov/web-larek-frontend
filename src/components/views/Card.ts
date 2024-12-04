import { EventEmitter } from '../base/events';
import { ProductModel } from '../models/ProductModel';

export class Card {
	private template: HTMLTemplateElement;
	public element: HTMLElement;
	public events: EventEmitter;
	private productModel: ProductModel;

	constructor(
		templateId: string,
		productModel: ProductModel,
		events: EventEmitter
	) {
		this.template = document.getElementById(templateId) as HTMLTemplateElement;
		this.element = this.template.content.cloneNode(true) as HTMLElement;
		this.productModel = productModel;
		this.events = events;

		this.element.dataset.id = this.productModel.getProductDetails().id;

		this.render();
	}
	render(): HTMLElement {
		const categoryElement = this.element.querySelector('.card__category');
		const titleElement = this.element.querySelector('.card__title');
		const imageElement = this.element.querySelector(
			'.card__image'
		) as HTMLImageElement;
		const priceElement = this.element.querySelector('.card__price');

		if (categoryElement) {
			categoryElement.textContent = this.productModel.category;
		}

		if (titleElement) {
			titleElement.textContent = this.productModel.title;
		}

		if (imageElement) {
			imageElement.src = this.productModel.image;
			imageElement.alt = this.productModel.title;
		}

		if (priceElement) {
			priceElement.textContent =
				this.productModel.price !== null
					? `${this.productModel.price} синапсов`
					: 'Цена не указана';
		}

		return this.element;
	}

	public update(productModel: ProductModel): void {
		this.productModel = productModel;
		this.render();
	}

	private setupEventListeners(): void {
		this.element.addEventListener('click', () => {
			this.openProductModal();
		});
	}

	public openProductModal(): void {
		this.events.emit('openProductModal', this.productModel);
	}
}
