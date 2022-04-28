import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BlobDto } from '../Contracts/Blob/blob-dto';
import { BlobLookUpDto } from '../Contracts/Blob/blob-lookup-dto';
import { ImageAssign as ImageAssignDto } from '../Contracts/Common/image';
import { InsertImageAssign as InsertImageAssignDto } from '../Contracts/Common/insert-image';
import { Response } from '../Contracts/Common/response';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  getFileByName(name: string) {
    const url = `files/${name}`;
    return this.httpClient.get<Blob>(url, { responseType: 'blob' });
  }
  constructor(private httpClient: HttpService) {}

  public getList(request: BlobLookUpDto) {
    const url = 'admin/blobs';
    return this.httpClient.get<Response<BlobDto[]>>(url, { params: request });
  }

  public upload(file: File, name: string): Observable<Response<BlobDto>> {
    const url = 'upload';
    const data = new FormData();
    data.append('file', file);
    data.append('name', name);
    return this.httpClient.post<Response<BlobDto>>(url, data);
  }

  public updateBlob(id: number, name: string, blob?: Blob) {
    const url = `blobs/${id}`;
    const data = new FormData();
    if (blob) {
      data.append('file', blob);
    }
    data.append('name', name);
    return this.httpClient.post<Response<number>>(url, data);
  }

  public uploadRange(
    files: File[],
    fileName?: string
  ): Observable<Response<BlobDto>> {
    const url = 'admin/upload';
    const data = new FormData();
    files.forEach((value, index) => {
      data.append(index.toString(), value);
    });
    if (fileName) {
      data.append('name', fileName);
    }
    return this.httpClient.post<Response<BlobDto>>(url, data);
  }

  public delete(id: number) {
    const url = `blobs/${id}`;
    return this.httpClient.delete<Response<number>>(url);
  }

  public createAssign(input: InsertImageAssignDto) {
    const url = 'admin/image_assigns';
    const payload = new FormData();
    payload.append('imageable_id', input.imageable_id.toString());
    payload.append('imageable_type', input.imageable_type);
    if (input.name) payload.append('name', input.name);
    if (input.file) payload.append('file', input.file);
    else if (input.blob_id) payload.append('blob_id', input.blob_id.toString());
    return this.httpClient.post<Response<ImageAssignDto>>(url, payload);
  }

  public deleteAssign(id: number) {
    const url = `admin/image_assigns/${id}`;
    return this.httpClient.delete<Response<number>>(url);
  }

  public duplicatedFilter() {
    const url = 'admin/file/duplicated-filter';
    return this.httpClient.post<Response<any>>(url);
  }

  public getFileByBlobId(id: number): Observable<Blob> {
    const url = `blobs/download/${id}`;
    return this.httpClient.get<Blob>(url, { responseType: 'blob' });
  }

  public duplicateBlob(id: number): Observable<Response<BlobDto>> {
    const url = `admin/blobs/duplicate/${id}`;
    return this.httpClient.post<Response<BlobDto>>(url);
  }
}
