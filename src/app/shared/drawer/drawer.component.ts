import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, CartItemComponent, DecimalPipe],
  templateUrl: './drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {
  cartItems$ = this._cartService.cartItems$;
  cartTotal$ = this._cartService.cartTotal$;
  isOrderComplete = false;

  constructor(
    private _cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  close() {
    this._cartService.close();
  }

  removeItem(id: number) {
    this._cartService.removeItem(id);
  }

  onCheckout() {
    this._cartService.clearCart();
    this.isOrderComplete = true;
    this._cdr.markForCheck();
  }
}
