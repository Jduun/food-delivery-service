import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

import { Filter, IItemFilterProps } from "@/types/itemfilter.interface";

export default function ItemFilter({ state, setState }: IItemFilterProps) {
  const handleChange = <K extends keyof Filter>(key: K, value: Filter[K]) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className="flex flex-col gap-3 md:w-[250px]">
        <>
          <Label className="text-lg">Цена</Label>
          <div className="flex flex-row gap-2">
            <Input
              className="text-base"
              value={state.priceRange[0]}
              onChange={(v) => {
                handleChange("priceRange", [
                  v.target.value,
                  state.priceRange[1],
                ]);
              }}
            ></Input>
            <Input
              className="text-base"
              value={state.priceRange[1]}
              onChange={(v) => {
                handleChange("priceRange", [
                  state.priceRange[0],
                  v.target.value,
                ]);
              }}
            ></Input>
          </div>
          <Slider
            className="w-full"
            value={state.priceRange.map((x) => {
              return parseInt(x);
            })}
            onValueChange={(v) => {
              handleChange(
                "priceRange",
                v.map((x) => {
                  return x.toString();
                }),
              );
            }}
            max={100}
            step={1}
          />
        </>

        <>
          <div className="flex items-center justify-between">
            <Label className="text-base" htmlFor="isAvailableToday">
              Можно забрать сегодня
            </Label>
            <Switch
              id="isAvailableToday"
              checked={state.isAvailableToday}
              onCheckedChange={(x) => {
                handleChange("isAvailableToday", x);
              }}
            />
          </div>
        </>

        <>
          <div className="flex items-center justify-between">
            <Label className="text-base" htmlFor="isVegan">
              Веганские
            </Label>
            <Switch
              id="isVegan"
              checked={state.isVegan}
              onCheckedChange={(x) => {
                handleChange("isVegan", x);
              }}
            />
          </div>
        </>
        <>
          <Accordion collapsible type="single">
            <AccordionItem value="item-1">
              <AccordionTrigger className="pt-0 text-lg">
                Аллергии
              </AccordionTrigger>
              <AccordionContent className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base" htmlFor="isNoGluten">
                    Продукты без глютена
                  </Label>
                  <Switch
                    id="isNoGluten"
                    checked={state.noGluten}
                    onCheckedChange={(x) => {
                      handleChange("noGluten", x);
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-base" htmlFor="isNoLactose">
                    Продукты без лактозы
                  </Label>
                  <Switch
                    id="isNoLactose"
                    checked={state.noLactose}
                    onCheckedChange={(x) => {
                      handleChange("noLactose", x);
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      </div>
    </div>
  );
}
