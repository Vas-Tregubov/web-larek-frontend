import { ISuccess, IActions } from '../../types';
import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccess> {
	protected button: HTMLButtonElement;
	protected price: HTMLElement;

	constructor(container: HTMLElement, actions?: IActions) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this.price = ensureElement<HTMLElement>(
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
		this.price.textContent = 'Списано ' + value + ' синапсов';
	}
}
