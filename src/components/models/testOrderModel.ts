import { EventEmitter } from '../base/events';
import { OrderModel } from './OrderModel';

// Создаем экземпляр EventEmitter для работы с событиями
const eventEmitter = new EventEmitter();

// Создаем экземпляр OrderModel с данными заказа
const order = new OrderModel(
	{
		payment: 'online',
		email: 'test@example.com',
		phone: '123-456-7890',
		address: '123 Main St',
		total: 0,
		items: ['1', '2'],
	},
	eventEmitter
);

// Тестируем получение данных заказа
console.log('Initial order details:', order.getOrderDetails());

// Тестируем обновление данных заказа
order.updateOrderDetails({ total: 200, email: 'updated@example.com' });
console.log('Updated order details:', order.getOrderDetails());

// Тестируем валидацию заказа
const isValid = order.validateOrder();
console.log('Is order valid?', isValid);

// Пример подписки на событие обновления заказа
eventEmitter.on('orderUpdated', (updatedOrder) => {
	console.log('Order was updated:', updatedOrder);
});

// Вызываем обновление заказа, чтобы увидеть работу события
order.updateOrderDetails({ address: '456 New St' });
