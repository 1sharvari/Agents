/**
 * @fileoverview Angular Client-Side Application Routing Module.
 * @module AppRoutingModule
 * @feature SHOP-32 - [Feature] User Authentication & Product Catalog Flow
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProductCatalogComponent } from './components/product-catalog/product-catalog.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductCatalogComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
