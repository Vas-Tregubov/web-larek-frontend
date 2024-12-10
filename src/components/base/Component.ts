export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	toggleElementState(element: HTMLElement, isActive: boolean): void {
		if (!isActive) {
			element.setAttribute('disabled', 'disabled');
		} else {
			element.removeAttribute('disabled');
		}
	}

	protected updateText(element: HTMLElement, value: string): void {
		element.textContent = String(value);
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
