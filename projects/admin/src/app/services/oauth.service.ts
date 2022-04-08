import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Response } from '../Contracts/Common/response';
import { UserDto } from '../Contracts/User/user-dto';
import { UserLoginDto } from '../Contracts/User/user-login-dto';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class OAuthService {


  constructor(private httpClient: HttpService) { }

  public login(payload:UserLoginDto)
  {
    const url = 'admin/login';
    return this.httpClient.post<Response<UserDto>>(url, payload);
  }

  public logout()
  {
    const url = 'admin/logout';
    return this.httpClient.post<Response<any>>(url);
  }
  
  public getUser()
  {
    const url = 'admin/user';
    return this.httpClient.get<Response<UserDto>>(url);
  }

}
