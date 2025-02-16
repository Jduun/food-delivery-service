import { IItemGridProps } from "@/types/item.interface";
import ItemCard from "@/components/itemcard";
import { Skeleton } from "@/components/ui/skeleton";

export default function ItemGrid({ cards }: IItemGridProps) {
  return (
    <>
      {cards.length === 1 && cards[0].id === -1 ? (
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(12)]
            .map((_, i) => {
              return i;
            })
            .map((i) => {
              return (
                <div
                  key={i}
                  className="bg-card text-card-foreground flex flex-col gap-y-2 rounded-xl border p-4 shadow"
                >
                  <Skeleton className="aspect-square h-auto w-full rounded-lg"></Skeleton>
                  <Skeleton className="h-4 w-5/6"></Skeleton>
                  <Skeleton className="h-4 w-30"></Skeleton>
                </div>
              );
            })}
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {cards.map((a, i) => {
            return <ItemCard key={i} item={a} />;
          })}
        </div>
      )}
    </>
  );
}
