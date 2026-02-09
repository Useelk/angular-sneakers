import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { HomeService } from '../home/home.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, CardComponent, RouterLink],
  templateUrl: './favorites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesComponent {
  favorites$ = this._homeService.$favoriteItems;
  isLoading = true;

  constructor(
    private _homeService: HomeService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._homeService
      .getItems({ search: '', sort: 'name' })
      .pipe(take(1))
      .subscribe(() => {
        this._homeService
          .getFavorites()
          .pipe(take(1))
          .subscribe(() => {
            this.isLoading = false;
            this._cdr.markForCheck();
          });
      });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}
