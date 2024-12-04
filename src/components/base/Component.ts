export abstract class Component<T> {
	constructor(protected readonly container: HTMLElement) {}

	toggleElementState(element: HTMLElement, isActive: boolean): void {
		if (!isActive) {
			element.setAttribute('disabled', 'disabled');
		} else {
			element.removeAttribute('disabled');
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}

	protected abstract createContent(): HTMLElement;
}
