import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { HomeService } from '../../pages/home/home.service';
import { CartService } from '../services/cart.service';
import { take } from 'rxjs';
import { CartItem } from '../../pages/home/home.interface';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  @Input() item: CartItem;

  constructor(
    private _homeService: HomeService,
    private _cartService: CartService,
    private _cdr: ChangeDetectorRef,
  ) {}

  get isInCart(): boolean {
    return this._cartService.isInCart(this.item.id);
  }

  onAddToCart() {
    if (this.isInCart) {
      this._cartService.removeItem(this.item.id);
    } else {
      this._cartService.addItem(this.item);
    }
    this._cdr.markForCheck();
  }

  onFavoriteClick() {
    if (!this.item.isFavorite) {
      this._homeService
        .addFavorite({ parentId: this.item.id })
        .pipe(take(1))
        .subscribe((value: any) => {
          this.item.isFavorite = true;
          this.item.favoriteId = value.id;
          this._cdr.markForCheck();
        });

      return;
    }

    this._homeService
      .deleteFavorite(this.item.favoriteId)
      .pipe(take(1))
      .subscribe(() => {
        this.item.isFavorite = false;
        delete this.item.favoriteId;
        this._cdr.markForCheck();
      });
  }
}
