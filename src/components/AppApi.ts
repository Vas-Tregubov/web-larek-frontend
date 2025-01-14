import { ApiCardResponse, ApiOrderResponse, IOrder } from '../types';
import { IApi } from './base/api';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getCards(): Promise<ApiCardResponse> {
		return this._baseApi.get<ApiCardResponse>(`/product`);
	}

	postOrder(order: IOrder): Promise<ApiOrderResponse> {
		return this._baseApi
			.post<ApiOrderResponse>(`/order`, order)
			.then((order: ApiOrderResponse) => order);
	}
}
