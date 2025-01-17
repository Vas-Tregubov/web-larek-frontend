import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccessActions {
	onClick: (event: MouseEvent) => void;
}

export interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	protected button: HTMLButtonElement;
	protected totalElement: HTMLElement;

	constructor(container: HTMLElement, actions?: ISuccessActions) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this.totalElement = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);

		if (actions?.onClick) {
			if (this.button) {
				this.button.addEventListener('click', actions.onClick);
			}
		}
	}

	set total(value: number) {
		this.totalElement.textContent = 'Списано ' + value + ' синапсов';
	}
}
