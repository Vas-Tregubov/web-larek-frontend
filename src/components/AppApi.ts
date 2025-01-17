import { ApiCardResponse, ApiOrderResponse, IOrder } from '../types';
import { IApi } from './base/api';

export class AppApi {
	private baseApi: IApi;

	constructor(baseApi: IApi) {
		this.baseApi = baseApi;
	}

	getCards(): Promise<ApiCardResponse> {
		return this.baseApi.get<ApiCardResponse>(`/product`);
	}

	postOrder(order: IOrder): Promise<ApiOrderResponse> {
		return this.baseApi
			.post<ApiOrderResponse>(`/order`, order)
			.then((order: ApiOrderResponse) => order);
	}
}
