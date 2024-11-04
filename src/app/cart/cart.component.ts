import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Product } from '../product';

interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.getItems().subscribe((items: CartItem[]) => {
      this.items = items;
      this.calculateTotalPrice();
    });
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    this.calculateTotalPrice();
  }


  proceedToCheckout() {
    alert('Checkout clicked');
  }
  


  clearCart() {
    this.items = this.cartService.clearCart();
    this.totalPrice = 0;
  }

  calculateTotalPrice() {
    this.totalPrice = this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
