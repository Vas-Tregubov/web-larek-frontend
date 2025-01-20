import { Model } from './base/Model';
import { IProduct } from '../types';

export class BasketData extends Model<IProduct> {
  public selectedProducts: IProduct[] = [];

  getSelectedProducts(): IProduct[] {
		return this.selectedProducts.filter((card) => card.selected);
	}

	getTotalPrice(): number {
		return this.getSelectedProducts().reduce(
			(total, card) => total + (card.price ?? 0),
			0
		);
	}

	resetSelected(): void {
		this.selectedProducts.forEach((card) => (card.selected = false));
		this.events.emit('basket:changed');
	}
}
