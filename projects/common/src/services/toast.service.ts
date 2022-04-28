import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageSerivce:MessageService) { }

  addSuccess(detail:string, summary:string = 'Thông báo', sticky:boolean = false)
  {
    this.messageSerivce.add({
      summary: summary,
      detail: detail,
      severity: 'success',
      icon : 'fas fa-check',
      sticky : sticky
    });
  }
  
  addError(detail:string, summary:string = 'Thông báo', sticky:boolean = false)
  {
    this.messageSerivce.add({
      summary: summary,
      detail: detail,
      severity: 'error',
      icon : 'fas fa-check',
      sticky : sticky
    });
  }
}
