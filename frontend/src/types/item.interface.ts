export interface Item {
  id: number;
  image: string;
  price: number;
  volume: string;
  name: string;
}

export interface IItemCardProps {
  item: Item;
}

export interface IItemGridProps {
  cards: Array<Item>;
}
