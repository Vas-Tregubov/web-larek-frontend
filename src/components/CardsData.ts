import { Model } from './base/Model';
import { ICardsData, IProduct } from '../types';

export class CardsData extends Model<ICardsData> {
	protected cardsData: IProduct[];
	protected previewData: string | null;

	set cards(cards: IProduct[]) {
		this.cardsData = cards;
		this.cardsData.forEach((card) => (card.selected = false));
	}

	get cards() {
		return this.cardsData;
	}

	setPreview(card: IProduct): void {
		this.previewData = card.id;
		this.events.emit('preview:changed', card);
	}

	getCard(cardId: string): IProduct | undefined {
		const card = this.cardsData.find((card) => card.id === cardId);
		if (card) {
			return card;
		} else {
			return undefined;
		}
	}

	toggleCardSelection(card: IProduct): void {
		if (!card.selected) {
			card.selected = true;
			this.events.emit('preview:changed', card);
		} else {
			card.selected = false;
		}
		this.events.emit('basket:changed');
	}
}
