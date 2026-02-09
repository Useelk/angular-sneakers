import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CartItem } from '../../pages/home/home.interface';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './cart-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItemComponent {
  @Input() item: CartItem;
  @Output() remove = new EventEmitter<number>();

  onRemove() {
    this.remove.emit(this.item.id);
  }
}
