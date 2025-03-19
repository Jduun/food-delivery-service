import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";
import { GetProductParams } from "@/@app_types/product.dto";
import { useItemRoutes } from "@/api/itemRoutes";

interface ItemFilterProps {
  state: GetProductParams;
  setState: React.Dispatch<React.SetStateAction<GetProductParams>>;
}

export default function ItemFilter({ state, setState }: ItemFilterProps) {
  const MAX_PRICE = 150;

  const [categories, setCategories] = useState<Array<string>>([]);
  const { getCategories } = useItemRoutes();
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleChange = <K extends keyof GetProductParams>(
    key: K,
    value: GetProductParams[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    getCategories().then((rs) => {
      if (rs) {
        setCategories(["", ...rs]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-3 md:w-[250px]">
        <Label className="text-lg">Цена</Label>
        <div className="flex flex-row gap-2">
          <Input
            className="text-base"
            type="number"
            value={state.minPrice}
            onChange={(e) => handleChange("minPrice", Number(e.target.value))}
          />
          <Input
            className="text-base"
            type="number"
            value={state.maxPrice || `${MAX_PRICE}`}
            onChange={(e) =>
              handleChange(
                "maxPrice",
                e.target.value ? Number(e.target.value) : MAX_PRICE,
              )
            }
          />
        </div>
        <Slider
          className="w-full"
          value={[state.minPrice, state.maxPrice ?? MAX_PRICE]}
          onValueChange={(v) => {
            handleChange("minPrice", v[0]);
            handleChange("maxPrice", v[1] || MAX_PRICE);
          }}
          max={MAX_PRICE}
          step={1}
        />

        <Label className="text-lg">Категория</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="h-12 w-full justify-between text-lg md:h-9 md:text-sm"
            >
              {selectedCategory || "Все категории"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-100 p-0 md:w-auto" align="start">
            <Command>
              <CommandInput
                className="text-lg md:text-base"
                placeholder="Поиск категории..."
              />
              <CommandList>
                <CommandEmpty>Категория не найдена.</CommandEmpty>
                <CommandGroup>
                  {categories.map((category) => (
                    <CommandItem
                      className="text-lg md:text-base"
                      key={category}
                      value={category}
                      onSelect={(currentValue) => {
                        const newCategory =
                          currentValue === selectedCategory ? "" : currentValue;
                        setSelectedCategory(newCategory);
                        handleChange("category", newCategory);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 size-6 md:size-4 ${selectedCategory === category ? "opacity-100" : "opacity-0"}`}
                      />
                      {category || "Все категории"}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
