import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { LazyLoadEvent } from 'primeng/api';
import { DataView } from 'primeng/dataview';
import { FileUpload } from 'primeng/fileupload';
import { environment } from 'projects/admin/src/environments/environment';
import { firstValueFrom } from 'rxjs';
import { BlobDto } from '../../../../../common/src/Contracts/Blob/blob-dto';
import { SortMode } from '../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { FileService } from '../../../../../common/src/lib/services/file.service';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { TitleService } from 'projects/admin/src/app/services/title.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css'],
})
export class ImagesComponent implements OnInit {
  @ViewChild('dv') dv!: DataView;
  @ViewChild('file') file!: FileUpload;
  @ViewChild(ImageCropperComponent) cropper!: ImageCropperComponent;
  loading: boolean = false;
  totalRecords: number = 0;
  blobs: BlobDto[] = [];
  fileName: string = '';
  selectedBlob: BlobDto | undefined;
  imgChangeEvt: any;
  croppedImage: string | undefined;
  
  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;

  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  imageChangedEvent: any = '';

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
  base64Image: string | undefined;
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

  public delete(blob: BlobDto) {
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
    if (this.uploadedFiles.length > 0) {
      this.loading = true;
      firstValueFrom(
        this.fileService.uploadRange(this.uploadedFiles, this.fileName)
      )
        .then((res) => {
          if (res?.status == true) {
            this.displayAddDialog = false;
            this.fileName = '';
            this.file.clear();
            this.uploadedFiles = [];
            this.toastService.addSuccess(`Đã tải lên ${res.data} ảnh`);
            this.loadBlob(this.dv.createLazyLoadMetadata());
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    }
  }

  public saveChange() {
    if (this.selectedBlob) {
      let blob;
      if (this.croppedImage) {
        const contentType = 'image/png';
        const b64Data = this.croppedImage.replace('data:image/png;base64,', '');
        blob = this.b64ToBlob(b64Data, contentType);
      }
      this.fileService
        .updateBlob(this.selectedBlob.id, this.fileName, blob)
        .subscribe((res) => {
          if (res.status == true) {
            this.selectedBlob = undefined;
            this.displayEditDialog = false;
            this.loadBlob(this.dv.createLazyLoadMetadata());
          }
        });
    }
  }

  onSelect(files: File[]) {
    this.uploadedFiles = files;
  }

  showEditDialog(blob: BlobDto) {
    this.selectedBlob = blob;
    this.displayEditDialog = true;
    this.displayAddDialog = false;
    this.fileService.getFileByName(blob.file_path).subscribe((res) => {
      var reader = new FileReader();
      reader.readAsDataURL(res);
      reader.onloadend = () => {
        this.base64Image = reader.result?.toString();
      };
    });
  }

  deleteDuplicatedImage() {
    this.loading = true;
    this.fileService.duplicatedFilter().subscribe((res) => {
      if (res.status == true) {
        this.toastService.addSuccess('Lọc ảnh trùng nhau hoàn tất.');
        this.loadBlob(this.dv.createLazyLoadMetadata());
      } else {
        this.loading = false;
      }
    });
  }

  onFileChange(event: any): void {
    this.imgChangeEvt = event;
  }

  b64ToBlob = (b64Data: any, contentType = '', sliceSize = 512) => {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  };

  imageCropped(event: ImageCroppedEvent) {
    if (event.base64) {
      this.croppedImage = event.base64.toString();
    }
  }

  duplicate(blob: BlobDto) {
    this.fileService.duplicateBlob(blob.id).subscribe((res) => {
      if (res.status) {
        this.toastService.addSuccess(`Đã nhân bản ${blob.name}`);
        this.loadBlob(this.dv.createLazyLoadMetadata());
      }
    });
  }

  searchBlob(value:string)
  {
    const meta = this.dv.createLazyLoadMetadata();
    meta.globalFilter = value;
    this.loadBlob(meta);
  }
}
