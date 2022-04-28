import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthDataService } from '../services/auth-data.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authDataService:AuthDataService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authDataService.token;
    if (token)
    {
      var tokenizedReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
      return next.handle(tokenizedReq);
    }
    return next.handle(request);
  }
}
