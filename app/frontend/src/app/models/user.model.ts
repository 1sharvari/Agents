/**
 * @fileoverview User and Authentication TypeScript interface models.
 * @module UserModel
 * @feature SHOP-35 - [Feature] User Authentication & Product Catalog Flow
 */

export interface User {
  username: string;
  name: string;
  email: string;
  role?: string;
  token?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}
