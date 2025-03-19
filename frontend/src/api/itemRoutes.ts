import axios from "axios";

import {
  GetProductParams,
  GetProductsReponse,
  ProductReponse,
} from "@/@app_types/product.dto";

export const API_STORE_ROUTE_PREFIX = "http://localhost/api/store";

export function useItemRoutes() {
  function getItems() {
    return axios.get(API_STORE_ROUTE_PREFIX + "/products").then((rs) => {
      if (rs) {
        return rs.data as GetProductsReponse;
      }
    });
  }

  function getCategories() {
    return axios
      .get(API_STORE_ROUTE_PREFIX + "/products/categories")
      .then((rs) => {
        if (rs) {
          return rs.data as Array<string>;
        }
      });
  }

  function searchItems({
    searchInput,
    offset,
    limit,
    category,
    minPrice,
    maxPrice,
    signal,
  }: Partial<GetProductParams> & { signal?: AbortSignal }) {
    const params: Record<string, string | number> = {};

    if (searchInput) params.searchInput = searchInput;
    if (offset !== undefined) params.offset = offset;
    if (limit !== undefined) params.limit = limit;
    if (category) params.category = category;
    if (minPrice !== undefined) params.minPrice = minPrice;
    if (maxPrice !== undefined) params.maxPrice = maxPrice;

    return axios
      .get(API_STORE_ROUTE_PREFIX + "/products", { params, signal })
      .then((rs) => rs?.data as GetProductsReponse)
      .catch((error) => {
        if (axios.isCancel(error)) {
          console.log("Request was canceled");
        } else {
          throw error;
        }
      });
  }

  function getItemById(id: string) {
    return axios.get(API_STORE_ROUTE_PREFIX + "/products/" + id).then((rs) => {
      if (rs) {
        return rs.data as ProductReponse;
      }
    });
  }

  function getItemsByCategory(category: string) {
    const filter: GetProductParams = {
      category: category,
      searchInput: "",
      offset: 0,
      limit: 10,
      minPrice: 0,
      maxPrice: undefined,
    };
    return axios
      .get(API_STORE_ROUTE_PREFIX + "/products", {
        params: { filter },
      })
      .then((rs) => {
        if (rs) {
          return rs.data as GetProductsReponse;
        }
      });
  }

  return {
    getItems,
    searchItems,
    getItemById,
    getCategories,
    getItemsByCategory,
  };
}
