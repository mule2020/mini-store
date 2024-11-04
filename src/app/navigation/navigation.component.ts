import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CartService } from '../cart/cart.service';
import { Observable } from 'rxjs';
import { Product } from '../product';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  cartItemCount: number = 0;
  isLoggedIn$: Observable<boolean>;

  constructor(private authService: AuthService, private cartService: CartService) {
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.cartService.getItems().subscribe((items: CartItem[]) => {
      this.cartItemCount = items.reduce((count, item) => count + item.quantity, 0);
    });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  logout() {
    this.authService.logout();
  }
}
