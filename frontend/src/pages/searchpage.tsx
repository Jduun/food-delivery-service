import PageTemplate from "@/pages/pageTemplate";
import { GetProductParams, ProductReponse } from "@/@app_types/product.dto";
import ItemGrid from "@/components/itemgrid";
import { useEffect, useState } from "react";
import { useItemRoutes } from "@/api/itemRoutes";
import { Label } from "@radix-ui/react-label";
import ItemFilter from "@/components/itemfilter";
import { useSearchParams } from "react-router";

export default function SearchPage() {
  const { searchItems } = useItemRoutes();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, _] = useSearchParams();
  const [items, setItems] = useState<Array<ProductReponse>>([]);
  const [, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<GetProductParams>({
    searchInput: "",
    offset: 0,
    limit: 10,
    category: "",
    minPrice: 0,
    maxPrice: undefined,
  });

  // debounce
  const [debouncedFilter, setDebouncedFilter] = useState(filter);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    searchItems(debouncedFilter).then((items) => {
      if (items) {
        setItems(items.products);
        setLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter]);

  useEffect(() => {
    setFilter({
      ...filter,
      searchInput: searchParams.get("q") ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <PageTemplate>
      <div className="p-4 md:ml-8 md:pl-[250px]">
        <Label className="text-xl">
          Результат по капросу {filter.searchInput}
        </Label>
      </div>
      <div className="flex flex-col gap-4 p-4 md:flex-row">
        <ItemFilter state={filter} setState={setFilter} />
        <ItemGrid loading={false} cards={items} />
      </div>
    </PageTemplate>
  );
}
