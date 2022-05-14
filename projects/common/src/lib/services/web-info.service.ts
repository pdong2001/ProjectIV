import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceResponse } from '../../Contracts/Common/response';
import { InsertUpdateWebInfoDto } from '../../Contracts/WebInfo/insert-update-webinfo-dto';
import { WebInfoDto } from '../../Contracts/WebInfo/webinfo-dto';
import { WebInfoLookUpDto } from '../../Contracts/WebInfo/webinfo-look-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class WebInfoService extends CRUDService<WebInfoDto, InsertUpdateWebInfoDto, WebInfoLookUpDto>  {
  protected override controller: string = 'admin/webinfos';
  constructor(httpClient:HttpService) {
    super(httpClient);
  }
}
