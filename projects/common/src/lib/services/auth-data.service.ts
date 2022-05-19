import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  getCustomerInfo() {
    return { id: 1 };
  }
  private readonly TokenKey = 'token';
  private _token!: string | null;
  constructor() {
    this.$token = new Observable<string | null>((subscriber) => {
      this.$tokenSubscriber = subscriber;
    });
    this.$token.subscribe();
  }

  public set token(token: string | null) {
    this._token = token;
    this.$tokenSubscriber.next(token);
    if (token) {
      localStorage.setItem(this.TokenKey, token);
    } else {
      localStorage.removeItem(this.TokenKey);
    }
  }
  protected $tokenSubscriber!: Subscriber<string | null>;
  public $token: Observable<string | null>;

  public get token(): string | null {
    if (!this._token) {
      this._token = localStorage.getItem(this.TokenKey);
    }
    return this._token;
  }

  public removeToken() {
    this.token = null;
  }

  public isLoggedIn(): boolean {
    return this.token != null;
  }
}
