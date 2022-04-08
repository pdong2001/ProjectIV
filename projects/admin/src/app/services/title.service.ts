import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  private readonly _pageTile$ = new BehaviorSubject<string>(''); 
  public readonly pageTile$ : Observable<string> =this._pageTile$.asObservable();
 constructor(private title:Title) {
  }
  public setPageTitle = (value:string) => {
    this._pageTile$.next(value);
  }
  public setTitle = (value:string) => {
    this.title.setTitle(value);
  }
}
