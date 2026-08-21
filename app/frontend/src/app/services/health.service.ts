/**
 * @fileoverview Health service monitoring backend availability.
 * @module HealthService
 * @feature SHOP-28 - [Feature] User Authentication & Product Catalog Flow
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly API_BASE = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<{ success: boolean; message: string; timestamp: string }> {
    return this.http.get<{ success: boolean; message: string; timestamp: string }>(`${this.API_BASE}/health`);
  }
}
