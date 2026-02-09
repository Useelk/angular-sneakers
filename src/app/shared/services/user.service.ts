import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../header/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private initialObj = {
    cartTotal: 0,
  };
  private _item: BehaviorSubject<User> = new BehaviorSubject(this.initialObj);

  get $item() {
    return this._item.asObservable();
  }

  constructor() {
    const data = this.getUserData();
    this._item.next(data);
  }

  update(value: User) {
    let data;
    try {
      data = JSON.stringify(value);
    } catch (error) {
      data = JSON.stringify(this.initialObj);
    }

    localStorage.setItem('user', data);
    this._item.next(value);
  }

  getUserData() {
    try {
      const stringData = localStorage.getItem('user');
      if (stringData) {
        return JSON.parse(stringData);
      } else {
        return this.initialObj;
      }
    } catch (error) {
      return this.initialObj;
    }
  }
}
