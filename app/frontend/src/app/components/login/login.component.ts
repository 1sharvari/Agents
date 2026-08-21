/**
 * @fileoverview Dedicated Login component managing reactive user authentication form.
 * @module LoginComponent
 * @feature SHOP-28 - [Feature] User Authentication & Product Catalog Flow
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  loginError = '';
  loginSuccess = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.router.navigate(['/products']);
    }
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginError = 'Please fill out all required fields properly.';
      return;
    }

    this.loading = true;
    this.loginError = '';
    this.loginSuccess = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.user) {
          this.loginSuccess = 'Login successful! Redirecting...';
          setTimeout(() => this.router.navigate(['/products']), 500);
        }
      },
      error: (err) => {
        this.loading = false;
        this.loginError = (err.error && err.error.message) ? err.error.message : 'Invalid username or password';
      }
    });
  }
}
