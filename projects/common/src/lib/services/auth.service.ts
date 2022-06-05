import { Injectable } from '@angular/core';
import { UserDto } from '../../Contracts/User/user-dto';
import { UserLoginDto } from '../../Contracts/User/user-login-dto';
import { HttpService } from './http.service';
import { ServiceResponse } from '../../Contracts/Common/response';
import { catchError, map, Observable, Subscriber } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthDataService } from './auth-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: UserDto | undefined;
  constructor(
    private httpClient: HttpService,
    private authDataService: AuthDataService
  ) {
    authDataService.$token.subscribe({
      next: (token) => {
        this.user = undefined;
      },
    });
  }

  public login(payload: UserLoginDto) {
    const url = 'login';
    return this.httpClient.post<ServiceResponse<UserDto>>(url, payload);
  }

  public logout() {
    const url = 'logout';
    return this.httpClient.post<ServiceResponse<any>>(url);
  }

  public removeUserData() {
    this.user = undefined;
  }

  public getUser() {
      if (this.user) {
        return new Observable<ServiceResponse<UserDto>>((subscriber) => {
          subscriber.next({ status: true, code: 200, data: this.user });
        });
      }
      const url = 'user';
      return this.httpClient.get<ServiceResponse<UserDto>>(url).pipe(
        catchError((error) => {
          console.log(error);
          if (error instanceof HttpErrorResponse && error.status == 401) {
            this.authDataService.removeToken();
          }
          throw error;
        }),
        map((res) => {
          if (res.status == true && res.data) {
            this.user = res.data;
          }
          return res;
        })
      );
  }

  public register(payload: { name: string; email: string; password: string }) {
    const url = 'register';
    return this.httpClient.post<ServiceResponse<never>>(url, payload);
  }
}
