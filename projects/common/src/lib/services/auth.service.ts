import { Injectable } from '@angular/core';
import { UserDto } from '../../Contracts/User/user-dto';
import { UserLoginDto } from '../../Contracts/User/user-login-dto';
import { HttpService } from './http.service';
import { ServiceResponse } from '../../Contracts/Common/response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpService) {}

  public login(payload: UserLoginDto) {
    const url = 'login';
    return this.httpClient.post<ServiceResponse<UserDto>>(url, payload);
  }

  public logout() {
    const url = 'logout';
    return this.httpClient.post<ServiceResponse<any>>(url);
  }

  public getUser() {
    const url = 'user';
    return this.httpClient.get<ServiceResponse<UserDto>>(url);
  }

  public register(payload: { name:string,email: string; password: string }) {
    const url = 'register';
    return this.httpClient.post<ServiceResponse<never>>(url, payload);
  }
}
