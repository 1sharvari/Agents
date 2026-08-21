/**
 * @fileoverview Product catalog grid component displaying items, category filters, and availability.
 * @module ProductCatalogComponent
 * @feature SHOP-32 - [Feature] User Authentication & Product Catalog Flow
 */

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-catalog',
  templateUrl: './product-catalog.component.html',
  styleUrls: ['./product-catalog.component.css']
})
export class ProductCatalogComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.products = res.products;
        }
      },
      error: () => {
        this.loading = false;
        this.products = [];
      }
    });
  }
}
