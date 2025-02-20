import brick from "/brick.jpg";

const default_items = [
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
];

export function getItems() {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(default_items.toString());
    });
  });
}
