import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Blob } from '../Contracts/Common/blob';
import { ImageAssign as ImageAssignDto } from '../Contracts/Common/image';
import { InsertImageAssign as InsertImageAssignDto } from '../Contracts/Common/insert-image';
import { PagedAndSortedRequest } from '../Contracts/Common/paged-and-sorted-request';
import { Response } from '../Contracts/Common/response';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient : HttpService) { }

  public getList(request:PagedAndSortedRequest)
  {
    const url = 'admin/blobs';
    return this.httpClient.get<Response<Blob[]>>(url, {params : request});
  }
  
  public upload(file: File, name:string) : Observable<Response<Blob>>
  {
    const url = 'upload';
    const data = new FormData();
    data.append('file', file);
    data.append('name', name)
    return this.httpClient.post<Response<Blob>>(url, data);
  }
  
  public updateBlob(id:number, name:string) {
    const url = `blobs/${id}`;
    const payload = {name : name};
    return this.httpClient.put<Response<number>>(url, payload);
  }

  public uploadRange(files: File[]) : Observable<Response<Blob>>
  {
    const url = 'admin/upload';
    const data = new FormData();
    files.forEach((value, index) => {
      data.append(index.toString(), value);
    });
    return this.httpClient.post<Response<Blob>>(url, data);
  }

  public delete(id:number)
  {
    const url = `blobs/${id}`;
    return this.httpClient.delete<Response<number>>(url);
  }

  public createAssign(input:InsertImageAssignDto)
  {
    const url = 'admin/image_assigns';
    const payload = new FormData();
    payload.append('imageable_id', input.imageable_id.toString());
    payload.append('imageable_type', input.imageable_type);
    if (input.file) payload.append('file', input.file);
    else if (input.blob_id) payload.append('blob_id', input.blob_id.toString());
    return this.httpClient.post<Response<ImageAssignDto>>(url, payload);
  }

  public deleteAssign(id:number)
  {
    const url = `admin/image_assigns/${id}`;
    return this.httpClient.delete<Response<number>>(url);
  }
}
