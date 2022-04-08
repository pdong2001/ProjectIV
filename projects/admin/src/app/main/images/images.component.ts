import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { FileUpload } from 'primeng/fileupload';
import { environment } from 'projects/admin/src/environments/environment';
import { Blob } from '../../Contracts/Common/blob';
import { SortMode } from '../../Contracts/Common/paged-and-sorted-request';
import { ConfirmService } from '../../services/confirm.service';
import { FileService } from '../../services/file.service';
import { TitleService } from '../../services/title.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  @ViewChild('dv') dv!: DataView;
  loading: boolean = false;
  totalRecords: number = 0;
  blobs: Blob[] = [];
  fileName: string = '';
  getFilePath(value: string) {
    if (!value) return '';
    return environment.FILE_GET_BY_NAME + value;
  }

  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;

  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  constructor(
    private titleService: TitleService,
    private fileService: FileService,
    private confirmService: ConfirmService,
    private toastService: ToastService
  ) {
    this.titleService.setPageTitle('Kho lưu trữ ảnh');
    this.titleService.setTitle('Admin - Hình ảnh');
  }
  uploadedFiles: any[] = [];
  ngOnInit(): void {}

  loadBlob(event: LazyLoadEvent) {
    this.loading = true;
    this.fileService
      .getList({
        limit: event.rows,
        page: ((event.first ?? 0) + (event.rows ?? 10)) / (event.rows ?? 10),
        column: event.sortField ?? '',
        sort: event.sortOrder
          ? event.sortOrder == 1
            ? SortMode.ACS
            : SortMode.DESC
          : '',
        search: event.globalFilter ?? '',
      })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.totalRecords = res.meta?.total ?? 0;
            this.blobs = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  public delete(blob: Blob) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${blob.name.toLocaleLowerCase()} khỏi kho lưu trữ? Hình ảnh sẽ bị xóa ở mọi nơi!`,
      () => {
        this.loading = true;
        this.fileService
          .delete(blob.id)
          .toPromise()
          .then((res) => {
            if (res?.status == true) {
              this.toastService.addSuccess(
                `Đã xóa ${blob.name.toLocaleLowerCase()} khỏi kho lưu trữ.`
              );
              this.loadBlob(this.dv.createLazyLoadMetadata());
            }
          });
      }
    );
  }

  public upload() {
    if (this.uploadedFiles.length > 1) {
      this.fileService
        .uploadRange(this.uploadedFiles)
        .toPromise()
        .then((res) => {
          if (res?.status == true) {
            this.loadBlob(this.dv.createLazyLoadMetadata());
          }
        });
    } else if (this.uploadedFiles.length == 1) {
      this.fileService
        .upload(this.uploadedFiles[0], this.fileName)
        .toPromise()
        .then((res) => {
          if (res?.status == true) {
            this.loadBlob(this.dv.createLazyLoadMetadata());
          }
        });
    }
  }

  onSelect(files: File[]) {
    this.uploadedFiles = files;
    console.log(files);
  }
}
