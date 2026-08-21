/**
 * @fileoverview Authentication service managing reactive user state with RxJS BehaviorSubject.
 * @module AuthService
 * @feature SHOP-28 - [Feature] User Authentication & Product Catalog Flow
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem('currentUser');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_BASE}/login`, credentials).pipe(
      tap(res => {
        if (res.success && res.user) {
          localStorage.setItem('currentUser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
