import PageTemplate from "@/pages/pageTemplate";

import ItemFilter from "@/components/itemfilter";
import { Filter } from "@/types/itemfilter.interface";

import ItemGrid from "@/components/itemgrid";
import { Item } from "@/types/item.interface";

import { useEffect, useState } from "react";

//////THIS HARDCODED//////
import brick from "/brick.jpg";
import { Label } from "@/components/ui/label";
//////////////////////////

export default function HomePage() {
  const [items, setItems] = useState<Array<Item>>([
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
    { id: 1, name: "Кирпич", image: brick, price: 4, volume: "4 кг" },
  ]);

  useEffect(() => {
    // setItems([]);
  }, []);

  const [filter, setFilter] = useState<Filter>({
    priceRange: ["0", "100"],
    isAvailableToday: false,
    isVegan: false,
    noGluten: false,
    noLactose: false,
  });

  return (
    <PageTemplate>
      <div className="p-4 md:ml-8 md:pl-[250px]">
        <Label className="text-xl">
          Результат по капросу кирпичиииии и ещё
        </Label>
      </div>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <ItemFilter state={filter} setState={setFilter} />
        <ItemGrid cards={items} />
      </div>
    </PageTemplate>
  );
}
