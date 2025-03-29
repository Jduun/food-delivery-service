import axios from "axios";

import { API_STORE_ROUTE_PREFIX } from "@/api/itemRoutes";
import { useUserRoutes } from "./userRoutes";
import { NavigateFunction } from "react-router";
import {
  GetOrderResponse,
  OrderProductResponse,
  OrderResponse,
} from "@/@app_types/order.dto";

export function useCartRoutes(navigate: NavigateFunction) {
  const { getToken, handleError } = useUserRoutes(navigate);

  function getOrders() {
    return axios
      .get(API_STORE_ROUTE_PREFIX + "/orders", {
        withCredentials: true,
        headers: { Authorization: "Bearer " + getToken() },
      })
      .catch((e) => handleError(e));
  }

  function getConfirmedOrders() {
    return getOrders().then((rs) => {
      if (rs) {
        const orders = rs.data as GetOrderResponse;
        const confirmedOrders = orders.orders.filter((order) => {
          return order.status === "confirmed";
        });
        return confirmedOrders;
      }
    });
  }

  function getItemsIdInOrder(orderId: string) {
    return axios
      .get(API_STORE_ROUTE_PREFIX + `/orders/${orderId}/products`, {
        withCredentials: true,
        headers: { Authorization: "Bearer " + getToken() },
      })
      .then((rs) => {
        return rs.data as Array<OrderProductResponse>;
      })
      .catch((e) => handleError(e));
  }

  function createCart() {
    return axios
      .post(
        API_STORE_ROUTE_PREFIX + "/orders",
        {},
        {
          withCredentials: true,
          headers: { Authorization: "Bearer " + getToken() },
        },
      )
      .catch((e) => handleError(e))
      .then((rs) => {
        if (rs) {
          return rs.data as OrderResponse;
        }
      });
  }

  function getCart() {
    return getOrders().then((rs) => {
      if (rs) {
        const orders = rs.data as GetOrderResponse;
        const carts = orders.orders.filter((order) => {
          return order.status === "cart";
        });

        if (carts.length === 0) {
          return createCart();
        } else {
          return carts.at(-1);
        }
      }
    });
  }

  function getCartItems() {
    return getCart().then((cart) => {
      if (cart) {
        return axios
          .get(API_STORE_ROUTE_PREFIX + "/orders/" + cart.id + "/products", {
            withCredentials: true,
            headers: { Authorization: "Bearer " + getToken() },
          })
          .then((rs) => {
            if (rs) {
              return rs.data as Array<OrderProductResponse>;
            }
          });
      }
    });
  }

  function addItemToCart(itemId: string) {
    return getCart().then((cart) => {
      if (cart) {
        return axios
          .post(
            API_STORE_ROUTE_PREFIX +
              "/orders/" +
              cart.id +
              "/products/" +
              itemId,
            {},
            {
              withCredentials: true,
              headers: { Authorization: "Bearer " + getToken() },
            },
          )
          .catch((e) => handleError(e));
      }
    });
  }

  function removeItemFromCart(itemId: string) {
    return getCart().then((cart) => {
      if (cart) {
        return axios
          .delete(
            API_STORE_ROUTE_PREFIX +
              "/orders/" +
              cart.id +
              "/products/" +
              itemId,
            {
              withCredentials: true,
              headers: { Authorization: "Bearer " + getToken() },
            },
          )
          .catch((e) => handleError(e));
      }
    });
  }

  function getItemCountInCart(itemId: string) {
    return getCart().then((cart) => {
      if (cart) {
        return axios
          .get(API_STORE_ROUTE_PREFIX + "/orders/" + cart.id + "/products", {
            withCredentials: true,
            headers: { Authorization: "Bearer " + getToken() },
          })
          .then((rs) => {
            if (rs) {
              const orderProducts = rs.data as Array<OrderProductResponse>;
              const orderProduct = orderProducts.filter((product) => {
                return product.productId === itemId;
              });

              if (orderProduct.length === 0) {
                return 0;
              } else {
                return orderProduct.at(0)?.count;
              }
            }
          });
          
      }
    });
  }

  function confirmCart() {
    return getCart().then((cart) => {
      if (cart) {
        if (cart.totalPrice !== 0) {
          return axios
            .post(
              API_STORE_ROUTE_PREFIX + "/orders/" + cart.id + "/confirm",
              {},
              {
                withCredentials: true,
                headers: { Authorization: "Bearer " + getToken() },
              },
            )
            .catch((e) => handleError(e));
        }
      }
    });
  }

  return {
    getOrders,
    getConfirmedOrders,
    getItemsIdInOrder,
    getCart,
    getCartItems,
    confirmCart,
    addItemToCart,
    removeItemFromCart,
    getItemCountInCart,
  };
}
