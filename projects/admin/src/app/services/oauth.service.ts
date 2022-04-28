import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Response } from '../../../../common/src/Contracts/Common/response';
import { UserDto } from '../../../../common/src/Contracts/User/user-dto';
import { UserLoginDto } from '../../../../common/src/Contracts/User/user-login-dto';
import { HttpService } from '../../../../common/src/services/http.service';

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
