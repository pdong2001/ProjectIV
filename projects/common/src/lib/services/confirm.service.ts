import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  constructor(private confirmationService: ConfirmationService) { }

  public confirm(message:string,accept : Function , header:string = 'Xác nhận')
  {
    this.confirmationService.confirm({
      message: message,
      header: header,
      acceptLabel : 'Xác nhận',
      rejectLabel : 'Hủy',
      acceptButtonStyleClass : 'p-button-success p-button-sm',
      rejectButtonStyleClass : 'p-button-danger p-button-sm',
      accept : accept
    })
  }
}
