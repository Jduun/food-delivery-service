import { IItemCardProps } from "@/types/item.interface";

export default function ItemCard({ item }: IItemCardProps) {
  return (
    <div className="bg-card text-card-foreground flex flex-col gap-y-2 rounded-xl border p-4 shadow">
      <img
        className="aspect-square h-auto rounded-lg object-contain"
        src={item.image}
      ></img>
      <p className="text-2xl font-semibold">{item.price}₽</p>
      <p className="line-clamp-2">{item.name}</p>
    </div>
  );
}
