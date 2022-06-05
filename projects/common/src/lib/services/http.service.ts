import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Inject, Injectable, Injector, ReflectiveInjector } from '@angular/core';
import { Route, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { catchError, Observable, throwError } from 'rxjs';
import { REST_API_SERVER } from '../../public-api';
import { AuthDataService } from './auth-data.service';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  protected static MessageService: MessageService;
  protected static Router: Router;
  protected static AuthDataService : AuthDataService;
  handleError(error: HttpErrorResponse) {
    switch (error.status) {
      case 500:
        // show toast báo lỗi server
        // console.log("Lỗi server");
        HttpService.MessageService.add({
          severity: 'error',
          detail: `Lỗi ${error.statusText}`,
        });
        break;
      case 401:
        HttpService.MessageService.add({
          severity: 'error',
          detail: `Bạn không có quyền truy cập chức năng này`,
        });
        HttpService.AuthDataService.removeToken();
        HttpService.Router.navigateByUrl("/account/login");
        break;
      default:
        break;
    }
    return throwError(() => error);
  }
  constructor(
    private httpClient: HttpClient,
    messageService: MessageService,
    authDataService : AuthDataService,
    router: Router,
    @Inject(REST_API_SERVER) private apiServerAddress : string
  ) {
    HttpService.MessageService = messageService;
    HttpService.Router = router;
    HttpService.AuthDataService = authDataService;
  }

  // Trong pipe() sẽ nhận được result hoặc error
  get<T>(url: string, options = {}): Observable<T> {
    return this.httpClient
      .get<T>(`${this.apiServerAddress}/${url}`, options)
      .pipe(catchError(this.handleError));
  }

  post<T>(url: string, data: any = null, options = {}): Observable<T> {
    return this.httpClient
      .post<T>(`${this.apiServerAddress}/${url}`, data, options)
      .pipe(catchError(this.handleError));
  }

  put<T>(url: string, data: any, options = {}): Observable<T> {
    return this.httpClient
      .put<T>(`${this.apiServerAddress}/${url}`, data, options)
      .pipe(catchError(this.handleError));
  }

  delete<T>(url: string, options = {}): Observable<T> {
    return this.httpClient
      .delete<T>(`${this.apiServerAddress}/${url}`, options)
      .pipe(catchError(this.handleError));
  }
}
