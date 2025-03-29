import { makeAutoObservable } from "mobx"
import { useItemRoutes } from "@/api/itemRoutes";
import { ProductReponse } from "@/@app_types/product.dto";

class ProductStore {
    products: ProductReponse[] = []

    constructor() {
			makeAutoObservable(this)
    }
		
    getProducts() {
      const { getItems } = useItemRoutes();

      getItems().then((rs) => {
        if (rs) {
          this.products = rs.products
        }
      })
    }
}

export default new ProductStore()