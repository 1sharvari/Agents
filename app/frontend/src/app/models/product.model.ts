/**
 * @fileoverview Product entity TypeScript interface model.
 * @module ProductModel
 * @feature SHOP-35 - [Feature] User Authentication & Product Catalog Flow
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}
