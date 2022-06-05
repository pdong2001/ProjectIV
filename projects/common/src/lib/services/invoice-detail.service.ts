import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from '../../Contracts/Common/response';
import { InsertUpdateInvoiceDetailDto } from '../../Contracts/InvoiceDetail/insert-update-invoice-detail-dto';
import { InvoiceDetailDto } from '../../Contracts/InvoiceDetail/invoice-detail-dto';
import { InvoiceDetailLookUpDto } from '../../Contracts/InvoiceDetail/invoice-detail-look-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDetailService extends CRUDService<InvoiceDetailDto, InsertUpdateInvoiceDetailDto, InvoiceDetailLookUpDto> {

  protected override controller: string = "admin/invoice-details";
  constructor(httpClient: HttpService) {super(httpClient) }
  public override update(id: any, input: InsertUpdateInvoiceDetailDto): Observable<ServiceResponse<number>> {
      throw new Error("Action not available");
  }
}
