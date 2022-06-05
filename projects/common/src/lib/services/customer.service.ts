import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PagedAndSortedRequest } from '../../Contracts/Common/paged-and-sorted-request';
import { ServiceResponse } from '../../Contracts/Common/response';
import { CustomerDto } from '../../Contracts/Customer/customer-dto';
import { UpSertCustomerDto } from '../../Contracts/Customer/up-sert-customer-dto';
import { AuthService } from './auth.service';
import { CRUDService } from './crudservice';
import { FileService } from './file.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends CRUDService<
  CustomerDto,
  UpSertCustomerDto,
  PagedAndSortedRequest
> {
  constructor(httpClient: HttpService,
    private authService: AuthService, private fileService: FileService) {
    super(httpClient);
  }
  protected override controller: string = "admin/customers";
  public async updateOne(input: UpSertCustomerDto, file?: File) {
    this.authService.removeUserData();
    if (file) {
      await firstValueFrom(this.fileService.upload(file, input.name)).then(
        (res) => {
          if (res.status == true) {
            input.blob_id = res.data?.id;
          }
        }
      );
    }
    const url = 'user';
    return this.httpClient.put<ServiceResponse<number>>(url, input);
  }
}
