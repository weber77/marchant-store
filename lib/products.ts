export type Product = {
  id: string;
  name: string;
  description: string;
  unitPrice: number;
  currency: string;
  imageEmoji: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "demo-sweat",
    name: "Trail sweatshirt",
    description: "Midweight fleece, unisex fit.",
    unitPrice: 68,
    currency: "USD",
    imageEmoji: "🧥",
  },
  {
    id: "demo-mug",
    name: "Ceramic camp mug",
    description: "12 oz, dishwasher safe.",
    unitPrice: 22,
    currency: "USD",
    imageEmoji: "☕",
  },
  {
    id: "demo-tote",
    name: "Canvas tote",
    description: "Reinforced straps, natural color.",
    unitPrice: 0.1,
    currency: "USD",
    imageEmoji: "🛍️",
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}
