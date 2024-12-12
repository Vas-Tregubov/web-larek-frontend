import { Model } from '../base/Model';
import { IProductList, IProduct } from '../../types/index';

export class ProductListData extends Model<IProductList> {
	protected products: IProduct[] = [];
	protected preview: string | null = null;

	set productList(products: IProduct[]) {
		this.products = products;
		this.products.forEach((product) => (product.selected = false));
	}

	get productList(): IProduct[] {
		return this.products;
	}

	updatePreview(product: IProduct): void {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
	}

	findProductById(productId: string): IProduct | undefined {
		return this.products.find((product) => product.id === productId);
	}

	toggleProductSelection(product: IProduct): void {
		product.selected = !product.selected;

		if (product.selected) {
			this.events.emit('preview:changed', product);
		}

		this.events.emit('basket:changed');
	}

	getSelectedProducts(): IProduct[] {
		return this.products.filter((product) => product.selected);
	}

	calculateTotalPrice(): number {
		return this.getSelectedProducts().reduce(
			(total, product) => total + product.price,
			0
		);
	}

	clearSelectedProducts(): void {
		this.products.forEach((product) => (product.selected = false));
		this.events.emit('basket:changed');
	}
}
