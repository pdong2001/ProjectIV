import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { ProviderDto } from 'projects/common/src/Contracts/Provider/provider-dto';
import { UpSertProviderDto } from 'projects/common/src/Contracts/Provider/upsert-provider-dto';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { FileService } from 'projects/common/src/lib/services/file.service';
import { ProviderService } from 'projects/common/src/lib/services/provider.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { TitleService } from '../../services/title.service';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.css'],
})
export class ProvidersComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  providers: ProviderDto[] = [];
  selectedCategories: ProviderDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  selectedProvider!: ProviderDto;
  visibleOptions = [
    { label: 'Tất cả', value: false },
    { label: 'Đang hiện thị', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];

  provider: UpSertProviderDto = { name: '', phone: '', visible: true };
  nameInvalid: boolean = false;

  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;

  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = value;
  }

  constructor(
    private breadCrumpService: TitleService,
    private providerService: ProviderService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private fileService : FileService
  ) {
    this.breadCrumpService.setPageTitle('Loại sản phẩm');
    this.breadCrumpService.setTitle('Admin - Loại sản phẩm');
  }

  ngOnInit(): void {}

  loadCategories(event: LazyLoadEvent) {
    this.loading = true;
    this.providerService
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
            this.providers = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.provider = { name: '', phone: '', visible: true };
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  async add(files: File[]) {
    if (this.provider.name != '') {
      if (files && files.length > 0) {
        await firstValueFrom(this.fileService.upload(files[0], this.provider.name))
        .then(res => {
          if (res.status)
          {
            this.provider.file_path = res.data?.file_path;
          }
        });
      }
      this.formVisible = false;
      this.loading = true;
      this.providerService
        .create(this.provider)
        .toPromise()
        .then((res) => {
          if (res?.status == true) {
            this.loadCategories(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(`Đã thêm ${this.provider.name}.`);
          }
        });
    }
  }

  async save(files: File[]) {
    if (this.provider.name != '') {
      if (files && files.length > 0) {
        await firstValueFrom(this.fileService.upload(files[0], this.provider.name))
        .then(res => {
          if (res.status)
          {
            this.provider.file_path = res.data?.file_path;
          }
        });
      }
      this.loading = true;
      this.providerService
        .update(this.selectedProvider.id, this.provider)
        .toPromise()
        .then((res) => {
          if (res?.status == true) {
            this.formVisible = false;
            this.toastService.addSuccess(`Chỉnh sửa ${this.provider.name}.`);
            this.loadCategories(this.dt.createLazyLoadMetadata());
          } else {
            this.loading = false;
            if (res?.meta?.name) {
              this.nameInvalid = true;
            }
            this.toastService.addError(
              `Chỉnh sửa ${this.provider.name} thất bại.`
            );
          }
        });
    }
  }

  delete(cate: ProviderDto) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${cate.name}`,
      () => {
        this.providerService
          .delete(cate.id)
          .toPromise()
          .then((res) => {
            if (res?.status) {
              this.loadCategories(this.dt.createLazyLoadMetadata());
              this.toastService.addSuccess(`Đã xóa ${cate.name}.`);
            } else {
              this.toastService.addError(`Xóa ${cate.name} thất bại.`);
            }
          });
      }
    );
  }

  showEditDialog(value: ProviderDto) {
    this.selectedProvider = value;
    this.provider = {
      name: value.name,
      phone: value.phone,
      address: value.address,
      visible: value.visible ?? true,
      file_path : value.file_path,
    };
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }
}
