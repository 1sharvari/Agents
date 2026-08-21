/**
 * @fileoverview Header navigation component displaying brand, user status, and backend health.
 * @module HeaderComponent
 * @feature SHOP-32 - [Feature] User Authentication & Product Catalog Flow
 */

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HealthService } from '../../services/health.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  backendHealthy = false;
  backendStatus = 'Checking health...';

  constructor(private authService: AuthService, private healthService: HealthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => this.currentUser = u);
    this.healthService.checkHealth().subscribe({
      next: (res) => {
        this.backendHealthy = res.success;
        this.backendStatus = res.message;
      },
      error: () => {
        this.backendHealthy = false;
        this.backendStatus = 'Backend is unreachable';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
