import { Injectable } from '@angular/core';
import { Product } from '../product';
import { BehaviorSubject } from 'rxjs';

interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = this.getCartItemsFromLocalStorage();
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.items);

  private getCartItemsFromLocalStorage(): CartItem[] {
    const items = localStorage.getItem('cartItems');
    return items ? JSON.parse(items) : [];
  }

  private saveCartItemsToLocalStorage() {
    localStorage.setItem('cartItems', JSON.stringify(this.items));
  }

  addToCart(product: Product) {
    const existingItem = this.items.find(item => item.product.id === product.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ product, quantity: 1 });
    }
    this.itemsSubject.next(this.items);
    this.saveCartItemsToLocalStorage();
  }

  removeFromCart(productId: number) {
    this.items = this.items.filter(item => item.product.id !== productId);
    this.itemsSubject.next(this.items);
    this.saveCartItemsToLocalStorage();
  }

  getItems() {
    return this.itemsSubject.asObservable();
  }

  clearCart() {
    this.items = [];
    this.itemsSubject.next(this.items);
    this.saveCartItemsToLocalStorage();
    return this.items;
  }
}
