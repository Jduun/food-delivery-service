import PageTemplate from "@/pages/pageTemplate";

// import ItemFilter from "@/components/itemfilter";

import { ProductReponse } from "@/@app_types/product.dto";

import ItemGrid from "@/components/itemgrid";

import { useEffect, useState } from "react";

// import { Label } from "@/components/ui/label";
import { useItemRoutes } from "@/api/itemRoutes";
// import { useNavigate } from "react-router";

export default function HomePage() {
  // const navigate = useNavigate();
  const { getItems } = useItemRoutes();
  const [items, setItems] = useState<Array<ProductReponse>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setItems([]);
    setLoading(true);
    getItems().then((items) => {
      if (items) {
        setItems(items.products);
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [filter, setFilter] = useState<GetProductParams>({
  //   searchInput: "",
  //   offset: 0,
  //   limit: 10,
  //   category: "",
  //   minPrice: 0,
  //   maxPrice: undefined,
  // });

  return (
    <PageTemplate>
      {/* <div className="p-4 md:ml-8 md:pl-[250px]">
        <Label className="text-xl">
          Результат по капросу кирпичиииии и ещё
        </Label>
      </div>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <ItemFilter state={filter} setState={setFilter} />
        <ItemGrid cards={[...items]} />
      </div> */}
      <div className="p-4">
        <ItemGrid loading={loading} cards={items} />
      </div>
    </PageTemplate>
  );
}
