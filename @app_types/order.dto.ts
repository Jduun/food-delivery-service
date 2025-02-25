export interface GetOrderParams {
  userId: string;
  offset: number;
  limit: number;
}

export interface CreateOrderDTO {
  userId: string;
  address: string;
}

export interface OrderResponse {
  id: string;
  userId: string;
  totalPrice: number;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrderResponse {
  orders: OrderResponse[];
  count: number;
}

export interface OrderProductResponse {
  orderId: string;
  productId: string;
  price: number;
  count: number;
}

export interface UpdateOrderProductDTO {
  price?: number;
  count?: number;
}