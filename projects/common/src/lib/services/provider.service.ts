import { Injectable } from '@angular/core';
import { PagedAndSortedRequest } from '../../Contracts/Common/paged-and-sorted-request';
import { ProviderDto } from '../../Contracts/Provider/provider-dto';
import { UpSertProviderDto } from '../../Contracts/Provider/upsert-provider-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProviderService extends CRUDService<ProviderDto, UpSertProviderDto, PagedAndSortedRequest> {
  protected override controller:string='admin/providers';
  constructor(httpClient :HttpService) {
    super(httpClient);
  }
}
