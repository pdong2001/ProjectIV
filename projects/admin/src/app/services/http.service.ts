import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private REST_API_SERVER = environment.REST_API_SERVER;

  private httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  handleError(error: HttpErrorResponse) {

    switch (error.status) {
      case 500:
        // show toast báo lỗi server
        console.log("Lỗi server");
        break;
      case 401:
        console.log("Unauthorized");
        break;
      default:
        break;
    }
    return throwError(error);
  }

  constructor(private httpClient: HttpClient, private router:Router) { }

  // Trong pipe() sẽ nhận được result hoặc error
  get<T>(url: string, options = {}): Observable<T> {
    return this.httpClient.get<T>(`${this.REST_API_SERVER}/${url}`, options).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, data: any = null, options = {}): Observable<T> {
    return this.httpClient.post<T>(`${this.REST_API_SERVER}/${url}`, data, options).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(url: string, data: any, options = {}): Observable<T> {
    return this.httpClient.put<T>(`${this.REST_API_SERVER}/${url}`, data, options).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string, options = {}): Observable<T> {
    return this.httpClient.delete<T>(`${this.REST_API_SERVER}/${url}`, options).pipe(
      catchError(this.handleError)
    );
  }

}
