/**
 * @fileoverview Main Angular component handling User Authentication and Product Catalog views.
 * @module AppComponent
 * @standards Clean Architecture, SOLID Principles, ESLint / Prettier
 * @feature User Authentication & Product Catalog / SHOP
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

export interface UserProfile {
  username: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Shop Application';
  apiUrl = 'http://localhost:3000/api';

  username = '';
  password = '';
  errorMessage = '';
  successMessage = '';
  isLoggedIn = false;
  currentUser: UserProfile | null = null;
  backendHealth: { success: boolean; message: string; timestamp?: string } | null = null;
  products: Product[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.checkHealth();
    this.loadProducts();
  }

  checkHealth(): void {
    this.http.get<{ success: boolean; message: string; timestamp?: string }>(`${this.apiUrl}/health`).subscribe({
      next: (res) => {
        this.backendHealth = res;
      },
      error: (err) => {
        this.backendHealth = { success: false, message: 'Backend unreachable' };
      }
    });
  }

  loadProducts(): void {
    this.http.get<{ success: boolean; products: Product[] }>(`${this.apiUrl}/products`).subscribe({
      next: (res) => {
        if (res.success) {
          this.products = res.products;
        }
      },
      error: () => {
        this.products = [];
      }
    });
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.username || !this.password) {
      this.errorMessage = 'Username and password are required';
      return;
    }

    this.http.post<{ success: boolean; message: string; user?: any }>(`${this.apiUrl}/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.isLoggedIn = true;
          this.successMessage = res.message;
          this.fetchUserProfile();
        } else {
          this.errorMessage = res.message;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid username or password';
      }
    });
  }

  fetchUserProfile(): void {
    this.http.get<{ success: boolean; user: UserProfile }>(`${this.apiUrl}/user`).subscribe({
      next: (res) => {
        if (res.success) {
          this.currentUser = res.user;
        }
      }
    });
  }

  logout(): void {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.username = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
  }
}

