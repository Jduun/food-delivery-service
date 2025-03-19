import PageTemplate from "@/pages/pageTemplate";
import { useCartRoutes } from "@/api/cartRoutes";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { OrderProductResponse, OrderResponse } from "@/@app_types/order.dto";
import { useItemRoutes } from "@/api/itemRoutes";
import { ProductReponse } from "@/@app_types/product.dto";
// import ItemGrid from "@/components/itemgrid";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const navigate = useNavigate();
  const { getItemById } = useItemRoutes();
  const { getCart, getCartItems } = useCartRoutes(navigate);
  const { addItemToCart, removeItemFromCart, confirmCart } =
    useCartRoutes(navigate);
  const [productChanged, setProductChanged] = useState(false);
  const [cart, setCart] = useState<OrderResponse>();
  const [cartProducts, setCartProducts] = useState<Array<OrderProductResponse>>(
    [],
  );
  const [products, setProducts] = useState<Array<ProductReponse>>([]);

  function getItemCount(productId: string) {
    return cartProducts
      .filter((orderProduct) => {
        return orderProduct.productId === productId;
      })
      .at(0)?.count;
  }

  useEffect(() => {
    getCart().then((cart) => {
      if (cart) {
        setCart(cart);
      }
    });
    getCartItems().then((items) => {
      if (items) {
        setCartProducts(items);
        Promise.all(
          items.map((orderProduct) => {
            return getItemById(orderProduct.productId);
          }),
        ).then((items) => {
          if (
            items.every((item) => {
              return item !== undefined;
            })
          ) {
            setProducts(items);
          }
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (productChanged) {
      getCartItems().then((items) => {
        if (items) {
          setCartProducts(items);
          setProductChanged(false);
        }
      });
      getCart().then((cart) => {
        if (cart) {
          setCart(cart);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productChanged]);
  return (
    <PageTemplate>
      <div className="p-4">
        {products.map((product) => {
          return (
            <div
              key={product.id}
              className="bg-card text-card-foreground flex flex-col items-center justify-between rounded-xl border p-6 shadow md:flex-row"
            >
              <Link
                to={"/product/" + product.id}
                className="flex flex-col items-center md:flex-row"
              >
                <img
                  className="mb-4 aspect-square h-40 w-40 rounded-lg object-contain md:mb-0"
                  src={product.image || ""}
                  alt={product.name}
                />

                <div className="flex-1 text-center md:mx-6 md:text-left">
                  <div className="text-xl font-semibold">{product.name}</div>
                  <div className="text-base text-gray-600">
                    {product.description}
                  </div>
                  <div className="text-xl font-bold">
                    {product.price}₽ / шт.
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex flex-row items-center gap-4 md:mt-0">
                <Button
                  onClick={() => {
                    removeItemFromCart(product.id || "").then(() => {
                      setProductChanged(true);
                    });
                  }}
                  disabled={(getItemCount(product.id) || 0) === 1}
                  variant="outline"
                  className="p-3 md:p-6"
                  size="icon"
                >
                  <Minus className="size-6 md:size-8" />
                </Button>
                <div className="p-3 text-2xl">
                  {getItemCount(product.id) || 0}
                </div>
                <Button
                  onClick={() => {
                    addItemToCart(product.id || "").then(() => {
                      setProductChanged(true);
                    });
                  }}
                  variant="outline"
                  className="p-3 md:p-6"
                  size="icon"
                >
                  <Plus className="size-6 md:size-8" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {cart &&
          (cartProducts.length !== 0 ? (
            <div className="p-4">
              <div className="flex flex-row justify-between px-5 pb-4 text-3xl font-semibold">
                <div>Итого:</div>
                <div></div>
                {cart.totalPrice}₽
              </div>
              <div className="p-3">
                <Button
                  className="w-full p-8 text-xl"
                  onClick={() => {
                    confirmCart().then(() => {
                      navigate("/orders");
                    });
                  }}
                >
                  Оформить заказ
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex w-full flex-col items-center justify-center gap-3">
              В корзине пусто
              <Button
                className="f-fit"
                onClick={() => {
                  navigate("/");
                }}
              >
                На главную
              </Button>
            </div>
          ))}
      </div>
    </PageTemplate>
  );
}
