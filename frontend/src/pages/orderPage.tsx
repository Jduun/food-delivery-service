import PageTemplate from "@/pages/pageTemplate";
import { ProductReponse } from "@/@app_types/product.dto";

import { useEffect, useState } from "react";

// import { Label } from "@/components/ui/label";
import { useItemRoutes } from "@/api/itemRoutes";
import { useCartRoutes } from "@/api/cartRoutes";
import { useNavigate } from "react-router";
import { OrderResponse } from "@/@app_types/order.dto";
import { Label } from "@radix-ui/react-label";
import ItemCard from "@/components/itemcard";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/text-format";
import { observer } from "mobx-react-lite"

export default function OrderPage() {
  const navigate = useNavigate();
  const { getItemById } = useItemRoutes();
  const { getConfirmedOrders, getItemsIdInOrder } = useCartRoutes(navigate);
  const [orders, setOrders] = useState<Array<OrderResponse>>([]);

  const [items, setItems] = useState<
    Array<Array<ProductReponse & { count?: number; totalPrice?: number }>>
  >([]);
  //   const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getConfirmedOrders().then((rs) => {
      if (rs) {
        Promise.all(
          rs.map((order) => {
            return getItemsIdInOrder(order.id).then((itemOrder) => {
              if (itemOrder) {
                return Promise.all(
                  itemOrder.map((orderProduct) => {
                    if (orderProduct) {
                      return getItemById(orderProduct.productId).then(
                        (order) => {
                          if (order) {
                            return Promise.resolve({
                              ...order,
                              count: orderProduct.count,
                              totalPrice: orderProduct.price,
                            });
                          }
                        },
                      );
                    }
                  }),
                );
              }
            });
          }),
        ).then((products) => {
          if (products) {
            setItems(products as Array<Array<ProductReponse>>);
          }
          setOrders(rs);
        });
      }
    });
  }, []);

  return (
    <PageTemplate>
      <div className="space-y-8 p-6">
        {orders.map((order, i) => (
          <div key={i} className="space-y-4 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <Label className="text-xl font-semibold">
                Заказ от {formatDate(order.createdAt)}
              </Label>
              <div className="text-2xl font-bold">
                Всего на {order.totalPrice}₽
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {items[i].map((a, idx) => (
                <ItemCard
                  key={idx}
                  item={a}
                  count={a.count}
                  totalPrice={a.totalPrice}
                />
              ))}
            </div>
            {i !== orders.length - 1 && <Separator className="" />}
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}
