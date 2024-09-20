import { EventEmitter } from '../base/events';
import { ProductModel } from './ProductModel';

// Создаем экземпляр EventEmitter для работы с событиями
const eventEmitter = new EventEmitter();

// Создаем экземпляр ProductModel с данными продукта
const product = new ProductModel(
	{
		id: '1',
		description: 'Test product description',
		image: '/path/to/image.jpg',
		title: 'Test Product',
		category: 'Electronics',
		price: 100,
	},
	eventEmitter
);

// Тестируем получение данных продукта
console.log('Initial product details:', product.getProductDetails());

// Тестируем обновление данных продукта
product.updateProductDetails({ price: 150, title: 'Updated Product' });
console.log('Updated product details:', product.getProductDetails());

// Тестируем валидацию продукта
const isValid = product.validateProduct();
console.log('Is product valid?', isValid);

// Пример подписки на событие обновления продукта
eventEmitter.on('productUpdated', (updatedProduct) => {
	console.log('Product was updated:', updatedProduct);
});

// Вызываем обновление продукта, чтобы увидеть работу события
product.updateProductDetails({ category: 'Updated Category' });
