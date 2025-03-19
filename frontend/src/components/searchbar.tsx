import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useItemRoutes } from "@/api/itemRoutes";
import { ProductReponse } from "@/@app_types/product.dto";
import ItemGrid from "./itemgrid";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";
import axios from "axios";

export default function SearchBar() {
  const { searchItems } = useItemRoutes();
  const [isFocused, setIsFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<Array<ProductReponse>>([]);
  const [, setLoading] = useState(false);

  // Abort controller to cancel ongoing requests
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchItems = useCallback(async (query: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const response = await searchItems({
        searchInput: query,
        limit: 4,
        signal: controller.signal,
      });
      if (response) setItems(response.products);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error("Search error", error);
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isFocused) {
      setSearchTerm("");
      setItems([]);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setItems([]);
      return;
    }

    const handler = setTimeout(() => {
      fetchItems(searchTerm);
    }, 500); // Debounce: 500ms

    return () => clearTimeout(handler);
  }, [searchTerm, fetchItems]);

  return (
    <div className="relative w-full">
      {/* overlay */}
      {isFocused && (
        <div
          className="fixed inset-0 z-10 bg-black/30"
          onClick={() => setIsFocused(false)}
        ></div>
      )}
      {/* searchbar */}
      <div className="relative z-20 mx-auto w-full">
        <div className="bg-card flex w-full items-center overflow-hidden rounded-md border shadow-xs">
          <Input
            placeholder="Search"
            className="w-full flex-1 border-none px-4 py-2 shadow-none focus:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          <Search className="text-muted-foreground mr-3 h-5 w-5" />
        </div>
      </div>
      {/* results */}
      {isFocused && searchTerm.length > 0 && (
        <div className="bg-card dark:bg-card absolute top-full left-0 z-30 mt-2 w-full rounded-lg shadow-lg">
          <div className="w-full py-2">
            {/* TODO здесь можно бахнуть историю поиска, но пока только текущий запрос */}
            <Link
              reloadDocument
              to={`/search?q=${encodeURIComponent(searchTerm)}`}
            >
              <div className="hover:bg-accent item-center text-md w-full p-3 font-medium">
                <div>Искать: {searchTerm}</div>
              </div>
            </Link>
            <Separator />
          </div>

          {items.length > 0 && (
            <div className="m-4">
              <ItemGrid loading={false} cards={items} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
