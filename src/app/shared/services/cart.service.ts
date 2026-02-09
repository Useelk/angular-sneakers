import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CartItem } from '../../pages/home/home.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cartItems: BehaviorSubject<CartItem[]>;
  private _isOpen = new BehaviorSubject<boolean>(false);

  get cartItems$(): Observable<CartItem[]> {
    return this._cartItems.asObservable();
  }

  get isOpen$(): Observable<boolean> {
    return this._isOpen.asObservable();
  }

  get cartTotal$(): Observable<number> {
    return this._cartItems
      .asObservable()
      .pipe(map((items) => items.reduce((sum, item) => sum + item.price, 0)));
  }

  constructor() {
    const saved = this.loadFromStorage();
    this._cartItems = new BehaviorSubject<CartItem[]>(saved);
  }

  addItem(item: CartItem) {
    const current = this._cartItems.getValue();
    if (current.find((i) => i.id === item.id)) {
      return;
    }
    const updated = [...current, item];
    this._cartItems.next(updated);
    this.saveToStorage(updated);
  }

  removeItem(itemId: number) {
    const updated = this._cartItems
      .getValue()
      .filter((i) => i.id !== itemId);
    this._cartItems.next(updated);
    this.saveToStorage(updated);
  }

  isInCart(itemId: number): boolean {
    return !!this._cartItems.getValue().find((i) => i.id === itemId);
  }

  open() {
    this._isOpen.next(true);
  }

  close() {
    this._isOpen.next(false);
  }

  clearCart() {
    this._cartItems.next([]);
    this.saveToStorage([]);
  }

  private saveToStorage(items: CartItem[]) {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch {
      // noop
    }
  }

  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem('cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
}
