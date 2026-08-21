/**
 * @fileoverview Product service managing product catalog HTTP requests.
 * @module ProductService
 * @feature SHOP-28 - [Feature] User Authentication & Product Catalog Flow
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ success: boolean; products: Product[] }> {
    return this.http.get<{ success: boolean; products: Product[] }>(`${this.API_BASE}/products`);
  }
}
