import { makeAutoObservable } from "mobx"
import { GetOrderResponse, OrderResponse } from "@/@app_types/order.dto"
import { useCartRoutes } from "@/api/cartRoutes"

class OrderStore {
    orders: OrderResponse[] | undefined

    constructor() {
			makeAutoObservable(this)
    }
		
    getOrders() {
			const { getConfirmedOrders } = useCartRoutes(() => {});

      getConfirmedOrders().then((rs) => {
        if (rs) {
          this.orders = rs
        }
      })
    }
}

export default new OrderStore()