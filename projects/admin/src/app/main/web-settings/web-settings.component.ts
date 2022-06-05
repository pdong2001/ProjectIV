import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'projects/admin/src/environments/environment';
import { BlobDto } from 'projects/common/src/Contracts/Blob/blob-dto';
import { InfoType } from 'projects/common/src/Contracts/WebInfo/info-type.enum';
import { InsertUpdateWebInfoDto } from 'projects/common/src/Contracts/WebInfo/insert-update-webinfo-dto';
import { WebInfoDto } from 'projects/common/src/Contracts/WebInfo/webinfo-dto';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { FileService } from 'projects/common/src/lib/services/file.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { WebInfoService } from 'projects/common/src/lib/services/web-info.service';
import { firstValueFrom } from 'rxjs';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-web-settings',
  templateUrl: './web-settings.component.html',
  styleUrls: ['./web-settings.component.css'],
})
export class WebSettingsComponent implements OnInit {
  public loading = false;
  public webinfos: WebInfoDto[] = [];
  public form: FormGroup;
  public displayAddDialog = false;
  public displayEditDialog = false;

  public selectedWebinfo: WebInfoDto | undefined;

  public tabActiveIndex: number = 0;

  public selectedBlobs: BlobDto[] = [];

  public get formVisible() {
    return this.displayAddDialog || this.displayEditDialog;
  }
  public set formVisible(value) {
    this.displayAddDialog = value;
    this.displayEditDialog = false;
  }

  public names: { value: InfoType; name: string }[] = [
    { value: InfoType.ContactIcon, name: 'Icon liên hệ' },
    { value: InfoType.Slide, name: 'Slide' },
    { value: InfoType.Header, name: 'Đầu trang' },
    { value: InfoType.Footer, name: 'Cuối trang' },
    { value: InfoType.Phone, name: 'Số điện thoại' },
    { value: InfoType.Email, name: 'Email' },
    { value: InfoType.Gallery, name: 'Bộ sưu tập' },
  ];

  constructor(
    private webinfoService: WebInfoService,
    private fileService: FileService,
    private toastService: ToastService,
    private comfirmService: ConfirmService,
    formBuilder: FormBuilder,
    titleService: TitleService
  ) {
    titleService.setPageTitle('Thiết lập thông tin trang chủ');
    titleService.setTitle('Admin - Web information');
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.maxLength(255)]],
      content: [''],
      link: ['', [Validators.maxLength(255)]],
      icon: ['', [Validators.maxLength(20)]],
    });
  }

  ngOnInit(): void {
    this.loadWebinfos();
  }

  public getName(value: InfoType) {
    return this.names.find((v) => v.value == value)?.name ?? value;
  }

  loadWebinfos() {
    this.loading = true;
    this.webinfoService.getList({}, false).subscribe({
      next: (res) => {
        if (res.status == true) {
          this.webinfos = res.data ?? [];
        }
      },
      error: (e) => {
        console.log(e);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  async save(file?: File) {
    if (this.form.valid) {
      this.loading = true;
      const dto: InsertUpdateWebInfoDto = { ...this.form.value };
      if (this.tabActiveIndex == 0 && file) {
        await firstValueFrom(this.fileService.upload(file, dto.name)).then(
          (res) => {
            if (res.status == true) dto.blob_id = res.data?.id;
          }
        );
      }
      else if (this.tabActiveIndex == 1 && this.selectedBlobs.length > 0)
      {
        dto.blob_id = this.selectedBlobs[0].id;
      }
      if (this.displayAddDialog) {
        this.webinfoService.create(dto).subscribe({
          next: (res) => {
            if (res.status == true) {
              this.toastService.addSuccess('Thêm thành công');
              this.loadWebinfos();
              this.formVisible = false;
            } else {
              this.loading = false;
            }
          },
          error: (e) => {
            console.log(e);
            this.loading = false;
          },
        });
      } else if (this.selectedWebinfo) {
        this.webinfoService.update(this.selectedWebinfo.id, dto).subscribe({
          next: (res) => {
            if (res.status == true) {
              this.toastService.addSuccess('Lưu thành công thành công');
              this.loadWebinfos();
              this.formVisible = false;
            } else {
              this.loading = false;
            }
          },
          error: (e) => {
            console.log(e);
            this.loading = false;
          },
        });
      }
    }
  }

  showAddDialog() {
    this.form.reset();
    this.selectedWebinfo = undefined;
    this.formVisible = true;
    this.selectedBlobs = [];
  }

  showEditDialog(info: WebInfoDto) {
    this.form.patchValue(info);
    this.selectedWebinfo = info;
    this.displayAddDialog = false;
    this.displayEditDialog = true;
    if (info.image)
    {
      this.selectedBlobs = [info.image];
    }
  }

  delete(info: WebInfoDto) {
    this.comfirmService.confirm(
      'Bạn có chắc chắn muốn xóa thiết lập này?',
      () => {
        this.webinfoService.delete(info.id).subscribe({
          next: (res) => {
            if (res.status == true) {
              this.toastService.addSuccess('Xóa thành công');
              this.loadWebinfos();
            } else {
              this.loading = false;
            }
          },
          error: (e) => {
            console.log(e);
            this.loading = false;
          },
        });
      }
    );
  }
}
