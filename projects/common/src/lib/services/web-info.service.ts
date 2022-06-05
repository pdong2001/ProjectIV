import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ServiceResponse } from '../../Contracts/Common/response';
import { InsertUpdateWebInfoDto } from '../../Contracts/WebInfo/insert-update-webinfo-dto';
import { WebInfoDto } from '../../Contracts/WebInfo/webinfo-dto';
import { WebInfoLookUpDto } from '../../Contracts/WebInfo/webinfo-look-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class WebInfoService extends CRUDService<
  WebInfoDto,
  InsertUpdateWebInfoDto,
  WebInfoLookUpDto
> {
  protected override controller: string = 'admin/webinfos';
  constructor(httpClient: HttpService) {
    super(httpClient);
  }
  protected webInfos: WebInfoDto[] | undefined;

  public override getList(
    request: WebInfoLookUpDto, cache:boolean = true
  ): Observable<ServiceResponse<WebInfoDto[]>> {
    if (this.webInfos && cache) {
      return new Observable<ServiceResponse<WebInfoDto[]>>((sub) => {
        sub.next({ status: true, code: 200, data: this.webInfos });
      });
    }
    return super.getList(request).pipe(map(res => {
      if (res.data && res.status === true)
      {
        this.webInfos = res.data;
      }
      return res;
    }));
  }
}
