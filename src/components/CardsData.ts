import { Model } from './base/Model';
import { ICardsData, IProduct } from '../types';

export class CardsData extends Model<ICardsData> {
	protected _cards: IProduct[];
	protected _preview: string | null;

	set cards(cards: IProduct[]) {
		this._cards = cards;
		this._cards.forEach((card) => (card.selected = false));
	}

	get cards() {
		return this._cards;
	}

	setPreview(card: IProduct): void {
		this._preview = card.id;
		this.events.emit('preview:changed', card);
	}

	getCard(cardId: string): IProduct | undefined {
		const card = this._cards.find((card) => card.id === cardId);
		if (card) {
			return card;
		} else {
			return undefined;
		}
	}

	toggleSelected(card: IProduct): void {
		if (!card.selected) {
			card.selected = true;
			this.events.emit('preview:changed', card);
		} else {
			card.selected = false;
		}
		this.events.emit('basket:changed');
	}

	getAddedProducts(): IProduct[] {
		return this._cards.filter((card) => card.selected);
	}

	getTotalPrice(): number {
		return this.getAddedProducts().reduce(
			(total, card) => total + card.price,
			0
		);
	}

	resetSelected(): void {
		this._cards.forEach((card) => (card.selected = false));
		this.events.emit('basket:changed');
	}
}
