import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { CartItem } from './home.interface';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private _items: BehaviorSubject<CartItem[]> = new BehaviorSubject(null);
  private _favorites: BehaviorSubject<CartItem[]> = new BehaviorSubject(null);

  get $items(): Observable<CartItem[]> {
    return this._items.asObservable();
  }

  get $favorites(): Observable<CartItem[]> {
    return this._favorites.asObservable();
  }

  get $favoriteItems(): Observable<CartItem[]> {
    return this._items
      .asObservable()
      .pipe(
        map((items) =>
          items ? items.filter((item) => item.isFavorite) : [],
        ),
      );
  }

  constructor(private _http: HttpClient) {}

  getItems(value: { search: string; sort: string }): Observable<CartItem[]> {
    const params: any = {};

    if (value.search) {
      params.title = `*${value.search}`;
    }

    if (value.sort) {
      params.sortBy = value.sort;
    }

    return this._http
      .get<CartItem[]>(`${environment.apiUrl}items`, { params: params })
      .pipe(
        map((data) => {
          return data.map((obj) => ({
            ...obj,
            price: obj.price / 100,
            isFavorite: false,
            isAdded: false,
          }));
        }),
        tap((data) => {
          this._items.next(data);
        }),
        catchError(() => {
          this._items.next([]);
          return of([]);
        }),
      );
  }

  getFavorites(): Observable<any[]> {
    return this._http.get<any[]>(`${environment.apiUrl}favorites`).pipe(
      tap((data) => {
        this._favorites.next(data);

        const modifiedItems = this._items.getValue().map((item) => {
          const favorite = data.find(
            (favorite) => favorite.parentId === item.id,
          );

          if (!favorite) {
            return item;
          }

          return {
            ...item,
            isFavorite: true,
            favoriteId: favorite.id,
          };
        });

        this._items.next(modifiedItems);
      }),
      catchError(() => of([])),
    );
  }

  addFavorite(data: { parentId: number }) {
    return this._http.post(`${environment.apiUrl}favorites`, data);
  }

  deleteFavorite(parentId: number) {
    return this._http.delete(`${environment.apiUrl}favorites/${parentId}`);
  }
}
