import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import { HomeService } from './home.service';
import { debounceTime, startWith, Subject, take, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CardComponent, ReactiveFormsModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  items$ = this._homeService.$items;
  form: FormGroup;
  isLoading = true;

  private _onSearchDestroy$: Subject<void> = new Subject();
  private _unsubscribeAll$: Subject<void> = new Subject();

  constructor(
    private _homeService: HomeService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.createForm();

    this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        takeUntil(this._unsubscribeAll$),
        debounceTime(300),
      )
      .subscribe((value) => {
        this._onSearchDestroy$.next();
        this.isLoading = true;
        this._cdr.markForCheck();

        this._homeService
          .getItems(value)
          .pipe(take(1), takeUntil(this._onSearchDestroy$))
          .subscribe(() => {
            this._homeService
              .getFavorites()
              .pipe(take(1))
              .subscribe(() => {
                this.isLoading = false;
                this._cdr.markForCheck();
              });
          });
      });
  }

  createForm() {
    this.form = this._fb.group({
      sort: ['name', Validators.required],
      search: '',
    });
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }

  ngOnDestroy() {
    this._unsubscribeAll$.next();
    this._unsubscribeAll$.complete();

    this._onSearchDestroy$.next();
    this._onSearchDestroy$.complete();
  }
}
