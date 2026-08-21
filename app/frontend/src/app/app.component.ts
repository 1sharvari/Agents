/**
 * @fileoverview Application Shell Component hosting header and router-outlet.
 * @module AppComponent
 * @feature SHOP-35 - [Feature] User Authentication & Product Catalog Flow
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SHOP Multi-Agent Platform';
}
