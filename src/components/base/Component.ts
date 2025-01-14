export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	setDisabled(element: HTMLElement, state: boolean): void {
		if (state) element.setAttribute('disabled', 'disabled');
		else element.removeAttribute('disabled');
	}

	protected setText(element: HTMLElement, value: string): void {
		element.textContent = String(value);
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
