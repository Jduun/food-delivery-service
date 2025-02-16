export interface Filter {
  priceRange: string[];
  isAvailableToday: boolean;
  isVegan: boolean;
  noGluten: boolean;
  noLactose: boolean;
}

export interface IItemFilterProps {
  state: Filter;
  setState: React.Dispatch<React.SetStateAction<Filter>>;
}
