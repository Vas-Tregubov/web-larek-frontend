export abstract class Component<T> {
	protected element: HTMLElement;
	protected data: T;

	constructor(element: HTMLElement) {
		this.element = element;
	}

	protected abstract createContent(): HTMLElement;

	render(data: T): HTMLElement {
		this.data = data;
		this.element.innerHTML = ''; // Очистим элемент перед рендером
		this.element.appendChild(this.createContent()); // Добавим новое содержимое
		return this.element;
	}
}
