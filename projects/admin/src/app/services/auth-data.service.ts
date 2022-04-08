import { Injectable } from '@angular/core';
import { UserDto } from '../Contracts/User/user-dto';
import { OAuthService } from './oauth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthDataService {
  private readonly TokenKey = 'token';
  private _token!:string|null;
  constructor() {}

  public set token(token: string | null) {
    this._token = token;
    if (token) {
      localStorage.setItem(this.TokenKey, token);
    } else {
      localStorage.removeItem(this.TokenKey);
    }
  }

  public get token(): string | null {
    if (!this._token) this._token = localStorage.getItem(this.TokenKey);
    return this._token;
  }

  public removeToken()
  {
    this.token = null;
  }

  public isLoggedIn() : boolean
  {
    return this.token != null;
  }
}
