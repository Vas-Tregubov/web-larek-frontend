import { IProduct } from '../../types';
import { EventEmitter } from '../base/events';

export class ProductModel {
	private id: string;
	private description: string;
	private image: string;
	private title: string;
	private category: string;
	private price: number | null;
	private events: EventEmitter;

	constructor(product: IProduct, events: EventEmitter) {
		this.id = product.id;
		this.description = product.description;
		this.image = product.image;
		this.title = product.title;
		this.category = product.category;
		this.price = product.price;
		this.events = events;
	}

	public getProductDetails(): IProduct {
		return {
			id: this.id,
			description: this.description,
			image: this.image,
			title: this.title,
			category: this.category,
			price: this.price,
		};
	}

	public updateProductDetails(update: Partial<IProduct>): void {
		Object.assign(this, update);

		// Вызов события после обновления данных
		this.events.emit('productUpdated', this.getProductDetails());
	}

	public validateProduct(): boolean {
		// Проверка на наличие всех обязательных полей
		if (
			!this.id ||
			!this.title ||
			!this.description ||
			!this.image ||
			!this.category
		) {
			console.log('Missing fields');
			return false;
		}

		// Проверка, чтобы цена не была отрицательной
		if (this.price !== null && this.price < 0) {
			console.log('Price is invalid');
			return false;
		}

		// Проверка формата ссылки на изображение
		const imageRegex = /\/[a-zA-Z0-9-_]+\.(jpg|jpeg|png|svg)$/;
		// Пример регулярного выражения
		if (!imageRegex.test(this.image)) {
			console.log('Image URL is invalid');
			return false;
		}

		return true;
	}
}
