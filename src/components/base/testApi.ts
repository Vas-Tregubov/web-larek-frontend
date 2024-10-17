import { Api } from './api';
import { EventEmitter } from './events';
import { OrderModel } from '../models/OrderModel';

const api = new Api('https://larek-api.nomoreparties.co/api/weblarek');

async function fetchProducts() {
	try {
		const response = await api.get('/product');
		console.log('List of products:', response);
	} catch (error) {
		console.error('Failed to fetch products:', error);
	}
}

// fetchProducts();

async function fetchProductById(productId: string) {
	try {
		const response = await api.get(`/product/${productId}`);
		console.log('Product details:', response);
	} catch (error) {
		console.error('Failed to fetch product:', error);
	}
}

// fetchProductById('90973ae5-285c-4b6f-a6d0-65d1d760b102');

const order = new OrderModel(
	{
		payment: 'credit_card',
		email: 'test@example.com',
		phone: '1234567890',
		address: '123 Test St, Test City',
		total: 1000,
		items: ['90973ae5-285c-4b6f-a6d0-65d1d760b102'],
	},
	new EventEmitter()
);

async function createOrder(orderData: object) {
	try {
		const response = await api.post('/order', orderData);
		console.log('Order created:', response);
	} catch (error) {
		console.error('Failed to create order:', error);
	}
}

// createOrder(order.getOrderDetails());
