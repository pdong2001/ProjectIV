import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { CustomerDto } from 'projects/common/src/Contracts/Customer/customer-dto';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { FileService } from 'projects/common/src/lib/services/file.service';
import { CustomerService } from 'projects/common/src/lib/services/customer.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { TitleService } from '../../services/title.service';
import { UpSertCustomerDto } from 'projects/common/src/Contracts/Customer/up-sert-customer-dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
})
export class CustomersComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild(FileUpload) upload!: FileUpload;
  customers: CustomerDto[] = [];
  selectedCategories: CustomerDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  selectedCustomer!: CustomerDto;
  visibleOptions = [
    { label: 'Tất cả', value: false },
    { label: 'Đang hiện thị', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];

  public nameInvalid: boolean = false;
  public selectedId: number | undefined;
  public displayAddDialog: boolean = false;
  public displayEditDialog: boolean = false;
  public displayInforDialog: boolean = false;

  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = value;
  }

  form: FormGroup;

  constructor(
    private breadCrumpService: TitleService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private fileService: FileService,
    formBuilder: FormBuilder
  ) {
    this.breadCrumpService.setPageTitle('Loại sản phẩm');
    this.breadCrumpService.setTitle('Admin - Loại sản phẩm');
    this.form = formBuilder.group({
      name: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      province: [''],
      district: [''],
      commune: [''],
      address: [''],
      birth: [''],
      bank_number: [''],
      bank_name: [''],
      note: [''],
    });
  }

  ngOnInit(): void {}

  processAddress(customer: CustomerDto) {
    let address = '';
    if (customer.province) address += `${customer.province}, `;
    if (customer.district) address += `${customer.district}, `;
    if (customer.commune) address += `${customer.commune}`;
    if (customer.address) address += ', ' + customer.address ?? '';
    return address;
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.customerService
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
            this.customers = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.form.reset();
    this.selectedId = undefined;
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }
  async save(files: File[]) {
    if (this.form.valid) {
      const data: UpSertCustomerDto = {
        ...this.form.value,
      };
      if (files.length > 0) {
        await firstValueFrom(
          this.fileService.upload(files[0], this.form.value.name)
        ).then((res) => {
          if (res.status == true) {
            data.blob_id = res.data?.id;
          }
        });
      }
      if (this.displayAddDialog) {
        this.customerService.create(data).subscribe((res) => {
          if (res.status == true) {
            this.loadData(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(
              `Thêm khách hàng ${data.name} thành công`
            );
            this.upload.clear();
            this.formVisible = false;
          }
        });
      } else if (this.displayEditDialog) {
        this.customerService.update(this.selectedId, data).subscribe((res) => {
          if (res.status == true) {
            this.loadData(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(
              `Chỉnh sửa khách hàng ${data.name} thành công`
            );
            this.upload.clear();
            this.formVisible = false;
          }
        });
      }
    }
    else{
      this.toastService.addError("Vui lòng nhập đầy đủ thông tin.");
    }
  }

  delete(cate: CustomerDto) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${cate.name}`,
      () => {
        this.customerService
          .delete(cate.id)
          .toPromise()
          .then((res) => {
            if (res?.status) {
              this.loadData(this.dt.createLazyLoadMetadata());
              this.toastService.addSuccess(`Đã xóa ${cate.name}.`);
            } else {
              this.toastService.addError(`Xóa ${cate.name} thất bại.`);
            }
          });
      }
    );
  }

  showEditDialog(value: CustomerDto) {
    this.form.patchValue(value);
    this.selectedId = value.id;
    this.displayAddDialog = false;
    this.displayEditDialog = true;
  }

  showInfoDialog(customer: CustomerDto)
  {
    this.displayInforDialog = true;
    this.selectedCustomer = customer;
  }
}
