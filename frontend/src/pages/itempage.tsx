import PageTemplate from "@/pages/pageTemplate";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ProductReponse } from "@/@app_types/product.dto";
import { useItemRoutes } from "@/api/itemRoutes";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import ItemCard from "@/components/itemcard";
import { useUserRoutes } from "@/api/userRoutes";
import { useCartRoutes } from "@/api/cartRoutes";
import { Minus, Plus } from "lucide-react";

// export interface IItemPageProps {}

export default function ItemPage() {
  const navigate = useNavigate();
  const { getItemById, getItemsByCategory } = useItemRoutes();
  const { addItemToCart, removeItemFromCart, getItemCountInCart } =
    useCartRoutes(navigate);
  const { getToken } = useUserRoutes(navigate);
  const { productId } = useParams();
  const [productCount, setProductCount] = useState({
    amount: 0,
    changed: false,
  });
  const [product, setProduct] = useState<ProductReponse>();
  const [sameItems, setSameItems] = useState<Array<ProductReponse>>();

  useEffect(() => {
    setProduct(undefined);
    if (productId) {
      getItemById(productId).then((item) => {
        if (item) {
          setProduct(item);

          getItemsByCategory(item.category).then((items) => {
            if (items) {
              setSameItems(items.products);
            }
          });
        }
      });
      if (getToken() !== "") {
        getItemCountInCart(productId).then((count) => {
          if (count) {
            setProductCount({ ...productCount, amount: count });
          }
        });
      }
    } else {
      // TODO: нужно редиректить на страничку с ошибкой
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (productCount.changed) {
      if (productId) {
        getItemCountInCart(productId).then((count) => {
          if (count !== undefined) {
            setProductCount({ amount: count, changed: false });
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productCount]);
  return (
    <PageTemplate>
      <div>
        {product ? (
          <>
            <div className="flex flex-col p-4 md:flex-row">
              <div className="flex w-full flex-col items-center text-left">
                <img
                  className="aspect-square h-auto w-3/4 rounded-lg object-contain"
                  src={product.image || ""}
                ></img>
              </div>
              <div className="flex w-full flex-col justify-center gap-3 md:pr-5 md:pl-[10%]">
                <Label className="pl-2 text-3xl font-semibold md:text-2xl">
                  {product.name}
                </Label>
                <Label className="text-primary/80 pl-4 text-xl">
                  {product.description}
                </Label>
                <Label className="bg-card w-fit rounded-xl border p-2 pt-1 text-3xl">
                  {product.price}₽ / шт.
                </Label>
                {productCount.amount === 0 ? (
                  <Button
                    onClick={() => {
                      addItemToCart(productId || "").then(() => {
                        setProductCount({ ...productCount, changed: true });
                      });
                    }}
                    className="w-full p-7 text-lg md:w-fit"
                  >
                    Добавить в корзину
                  </Button>
                ) : (
                  <div className="flex flex-row items-center gap-2">
                    <Button
                      onClick={() => {
                        navigate("/cart");
                      }}
                      className="flex w-full flex-col p-7 text-lg md:w-fit"
                    >
                      <div className="leading-4">В корзине</div>
                      <div className="text-base leading-4 font-normal">
                        перейти
                      </div>
                    </Button>
                    <Button
                      onClick={() => {
                        removeItemFromCart(productId || "").then(() => {
                          setProductCount({ ...productCount, changed: true });
                        });
                      }}
                      variant="outline"
                      className="p-7"
                      size="icon"
                    >
                      <Minus className="size-6" />
                    </Button>
                    <div className="p-4 text-xl">{productCount.amount}</div>
                    <Button
                      onClick={() => {
                        addItemToCart(productId || "").then(() => {
                          setProductCount({ ...productCount, changed: true });
                        });
                      }}
                      variant="outline"
                      className="p-7"
                      size="icon"
                    >
                      <Plus className="size-6" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            {sameItems && (
              <>
                <Separator className="w-full" />
                <div className="flex flex-col gap-2 p-4">
                  <Label className="text-xl">
                    Продукты из той же категории
                  </Label>
                  <ScrollArea className="">
                    <div className="flex flex-row gap-2">
                      {sameItems.map((p) => {
                        return (
                          <ItemCard
                            key={p.id}
                            className="w-50"
                            item={p}
                          ></ItemCard>
                        );
                      })}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </>
            )}
          </>
        ) : (
          // <>TODO: нужно редиректить на страничку с ошибкой</>
          <></>
        )}
      </div>
    </PageTemplate>
  );
}
