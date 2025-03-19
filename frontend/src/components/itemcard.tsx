// import { IItemCardProps } from "@/types/item.interface";
import { ProductReponse } from "@/@app_types/product.dto";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";
import { getCorrectForm } from "@/lib/text-format";

interface IItemCardProps {
  item: ProductReponse;
  className?: string;
  count?: number;
  totalPrice?: number;
}

export default function ItemCard({
  item,
  className,
  count,
  totalPrice,
}: IItemCardProps) {
  return (
    <Link to={"/product/" + item.id}>
      <div
        className={cn(
          "bg-card text-card-foreground flex flex-col gap-y-2 rounded-xl border p-4 shadow",
          className,
        )}
      >
        <img
          className="aspect-square h-auto rounded-lg object-contain"
          src={item.image || ""}
        ></img>
        {/* text-2xl */}
        <p
          className={`font-semibold ${totalPrice === undefined ? "text-2xl" : "text-base"}`}
        >
          {item.price}₽
        </p>
        <p className="text-muted-foregroundforeground">{item.description}</p>
        <p className="line-clamp-2 h-12">{item.name}</p>
        {count && totalPrice && (
          <>
            <Separator></Separator>
            <div>Куплено {getCorrectForm(count)}</div>
            <div className="text-xl font-semibold">На {totalPrice}₽</div>
          </>
        )}
      </div>
    </Link>
  );
}
