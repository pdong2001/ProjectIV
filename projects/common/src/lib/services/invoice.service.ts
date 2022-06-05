import { Injectable } from '@angular/core';
import { InsertUpdateInvoiceDto } from '../../Contracts/Invoice/insert-update-invoice-dto';
import { InvoiceDto } from '../../Contracts/Invoice/invoice-dto';
import { InvoiceLookUpDto } from '../../Contracts/Invoice/invoice-loop-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends CRUDService<InvoiceDto, InsertUpdateInvoiceDto, InvoiceLookUpDto> {

  protected override controller: string = "admin/invoices";
  constructor(httpClient:HttpService) { super(httpClient) }

}
