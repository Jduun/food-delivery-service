import { useEffect, useState } from "react";
import PageTemplate from "@/pages/pageTemplate";
import { Button } from "@/components/ui/button";
import { useUserRoutes } from "@/api/userRoutes";
import { useNavigate } from "react-router";
import { ProductReponse } from "@/@app_types/product.dto";
import { useCartRoutes } from "@/api/cartRoutes";
import { useItemRoutes } from "@/api/itemRoutes";
import { OrderResponse } from "@/@app_types/order.dto";
import { Label } from "@radix-ui/react-label";
import { formatDate } from "@/lib/text-format";
import ItemCard from "@/components/itemcard";
import { CreditCard, ShoppingCart } from "lucide-react";
import { observer } from "mobx-react-lite"
import authStore from "@/store/authStore";

const ProfilePage = observer(() => {
  const navigate = useNavigate();
  const { getItemById } = useItemRoutes();
  const { getConfirmedOrders, getItemsIdInOrder } = useCartRoutes(navigate);
  const { clearToken } = useUserRoutes(navigate);
  const [orders, setOrders] = useState<Array<OrderResponse>>([]);
  const [items, setItems] = useState<
    Array<Array<ProductReponse & { count?: number; totalPrice?: number }>>
  >([]);

  useEffect(() => {
    console.log("I'm")
    if (!authStore.user.username) {
      authStore.getUserInfo()
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageTemplate>
      <div className="space-y-6 p-6">
        <div className="flex flex-row justify-between">
          <div className="text-lg font-medium">Вас зовут {authStore.user.username}</div>
          <Button onClick={clearToken} className="text-primary-foreground">
            Я хочу выйти
          </Button>
        </div>

        {/* Виджеты */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-card border-border flex items-center rounded-lg border p-4 shadow">
            <div className="bg-muted text-muted-foreground rounded-full p-3">
              <CreditCard size={24} />
            </div>
            <div className="ml-4">
              <div className="text-muted-foreground text-sm">
                Всего потрачено
              </div>
              <div className="text-card-foreground text-xl font-semibold">
                {orders.reduce((a, i) => a + i.totalPrice, 0)}₽
              </div>
            </div>
          </div>
          <div className="bg-card border-border flex items-center rounded-lg border p-4 shadow">
            <div className="bg-muted text-muted-foreground rounded-full p-3">
              <ShoppingCart size={24} />
            </div>
            <div className="ml-4">
              <div className="text-muted-foreground text-sm">Куплено</div>
              <div className="text-card-foreground text-xl font-semibold">
                {items.reduce((a, i) => a + (i?.length ?? 0), 0)} продукта
              </div>
            </div>
          </div>
        </div>

        {/* Последний заказ */}
        {orders && orders.length >= 1 && (
          <div className="rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <Label className="text-card-foreground text-xl font-semibold">
                Последний заказ от{" "}
                {formatDate(orders[orders.length - 1].createdAt)}
              </Label>
              <div className="text-card-foreground text-2xl font-bold">
                Всего на {orders[orders.length - 1].totalPrice}₽
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {items[orders.length - 1].map((a, idx) => (
                <ItemCard
                  key={idx}
                  item={a}
                  count={a.count}
                  totalPrice={a.totalPrice}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTemplate>
  );
})

export default ProfilePage;
