import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [CommonModule, CartItemComponent, DecimalPipe],
  templateUrl: './drawer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('250ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('250ms ease-out', style({ opacity: 0.7 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class DrawerComponent implements OnInit, OnDestroy {
  cartItems$ = this._cartService.cartItems$;
  cartTotal$ = this._cartService.cartTotal$;
  isOrderComplete = false;
  orderNumber: number;

  constructor(
    private _cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  close() {
    this._cartService.close();
  }

  removeItem(id: number) {
    this._cartService.removeItem(id);
  }

  onCheckout() {
    this._cartService.clearCart();
    this.orderNumber = Math.floor(Math.random() * 9000) + 1000;
    this.isOrderComplete = true;
    this._cdr.markForCheck();
  }
}
