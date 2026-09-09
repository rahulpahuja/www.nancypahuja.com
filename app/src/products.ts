export interface Product {
  id: string;
  name: string;
  collection: string;
}

/**
 * Lightweight product catalogue used by the Product Shots feature.
 * The storefront prototypes are static HTML, so this is the single place the
 * React hub knows about individual products. Kept intentionally small until a
 * real catalogue service is connected.
 */
export const products: Product[] = [
  { id: 'ethereal-bloom', name: 'Ethereal Bloom', collection: 'Signature Lawn' },
  { id: 'gulab-suit', name: 'Gulab Suit', collection: 'Artisanal Embroidered Lawn' },
  { id: 'jasmine-suit', name: 'Jasmine Suit', collection: 'Classic Printed Lawn' },
  { id: 'lotus-suit', name: 'Lotus Suit', collection: 'Premium Festive Lawn' },
  { id: 'marigold-suit', name: 'Marigold Suit', collection: 'Everyday Essential Lawn' },
  { id: 'orchid-suit', name: 'Orchid Suit', collection: 'Signature Lawn Collection' },
  { id: 'tulip-suit', name: 'Tulip Suit', collection: 'Evening Wear Lawn' },
];

const productMap = new Map(products.map((product) => [product.id, product]));

export function findProduct(id: string | undefined): Product | undefined {
  return id ? productMap.get(id) : undefined;
}

/**
 * Deterministic pastel gradient per product so thumbnails render instantly
 * without depending on external image hosts.
 */
export function productSwatch(id: string): string {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 360;
  }
  const hue = Math.abs(hash);
  return `linear-gradient(135deg, hsl(${hue} 45% 88%), hsl(${(hue + 40) % 360} 40% 74%))`;
}
