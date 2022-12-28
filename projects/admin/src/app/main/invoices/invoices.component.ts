import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { SortMode } from '../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { TitleService } from '../../services/title.service';
import { Table } from 'primeng/table';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { InvoiceDto } from 'projects/common/src/Contracts/Invoice/invoice-dto';
import { InsertUpdateInvoiceDto } from 'projects/common/src/Contracts/Invoice/insert-update-invoice-dto';
import { InvoiceService } from 'projects/common/src/lib/services/invoice.service';
import { firstValueFrom } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomerDto } from 'projects/common/src/Contracts/Customer/customer-dto';
import { CustomerService } from 'projects/common/src/lib/services/customer.service';
import { InvoiceDetailDto } from 'projects/common/src/Contracts/InvoiceDetail/invoice-detail-dto';
import { InvoiceDetailService } from 'projects/common/src/lib/services/invoice-detail.service';
import { ProductDetailDto } from 'projects/common/src/Contracts/ProductDetail/product-detail-dto';
import { ProductDetailService } from 'projects/common/src/lib/services/product-detail.service';
import { forbiddenValue } from 'projects/common/src/public-api';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
})
export class InvoicesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @Input('customer')
  public set customer(value: CustomerDto | undefined) {
    this._customer = value;
    if (value) this.customers = [value];
    if (this.dt) this.loadInvoices(this.dt.createLazyLoadMetadata());
  }
  private _customer: CustomerDto | undefined;
  public get customer(): CustomerDto | undefined {
    return this._customer;
  }
  @Input('readonly')
  public set readonly(value: boolean) {
    this._readonly = value;
  }
  private _readonly: boolean = false;
  public get readonly(): boolean {
    return this._readonly;
  }
  private _selectedCustomer: CustomerDto | undefined;
  public get selectedCustomer(): CustomerDto | undefined {
    return this._selectedCustomer;
  }
  public set selectedCustomer(value: CustomerDto | undefined) {
    this._selectedCustomer = value;
    if (value) {
      this.form.patchValue({
        customer_name: value.name,
        province: value.province,
        district: value.district,
        commune: value.commune,
        phone_number: value.phone_number,
        address: value.address,
        customer_id: value.id,
      });
    }
  }
  isReadonly: boolean = false;
  private _selectedProduct: ProductDetailDto | undefined;
  public get selectedProduct(): ProductDetailDto | undefined {
    return this._selectedProduct;
  }
  public set selectedProduct(value: ProductDetailDto | undefined) {
    this._selectedProduct = value;
    if (value) {
      this.detailForm.patchValue({
        price: value.out_price,
      });
    }
  }
  public productDetails: ProductDetailDto[] = [];
  private _details: InvoiceDetailDto[] = [];
  public get details(): InvoiceDetailDto[] {
    return this._details;
  }
  public set details(value: InvoiceDetailDto[]) {
    this._details = value;
    this.calTotal();
  }
  newDetails: InvoiceDetailDto[] = [];
  deleteDetails: number[] = [];
  invoices: InvoiceDto[] = [];
  selectedInvoices: InvoiceDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  public customers: CustomerDto[] = [];
  loading: boolean = true;
  private _selectedInvoice: InvoiceDto | undefined;
  public get selectedInvoice(): InvoiceDto | undefined {
    return this._selectedInvoice;
  }
  public set selectedInvoice(value: InvoiceDto | undefined) {
    this._selectedInvoice = value;
    this.isReadonly =
      (value?.status ?? 0) == 4 ||
      (value?.status ?? 0) == 5 ||
      (value?.status == 3 && this.readonly);
    if (value) {
      this.details = [];
      this.invoiceDetalService
        .getList({
          invoice_id: value.id,
          page: 1,
          limit: 1000,
          with_detail: true,
        })
        .subscribe((res) => {
          if (res.status == true && res.data) {
            res.data.forEach((item) => {
              if (item.product_detail)
                item.product_detail.name = item.product_detail?.product?.name;
            });
            this.details = res.data;
            if (this.selectedInvoice)
              this.selectedInvoice.details = [...res.data];
          }
        });
    }
  }

  public statusOptions = [
    { value: 1, label: 'Đang xử lý' },
    { value: 2, label: 'Đã chấp nhận' },
    { value: 3, label: 'Đang chuẩn bị' },
    { value: 4, label: 'Đang giao' },
    { value: 5, label: 'Hoàn tất' },
    { value: 6, label: 'Từ chối' },
    { value: 7, label: 'Hủy' },
    { value: 8, label: 'Trả hàng' },
  ];

  public selectedStatus: { value: number; label: string } | undefined =
    this.statusOptions[0];

  invoice: InsertUpdateInvoiceDto | undefined;
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

  public form: FormGroup;
  public detailForm: FormGroup;
  public total: number = 0;
  constructor(
    private breadCrumpService: TitleService,
    private invoiceService: InvoiceService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private confirmationService: ConfirmationService,
    private customerService: CustomerService,
    private invoiceDetalService: InvoiceDetailService,
    private productDetailService: ProductDetailService
  ) {
    if (!this.customer) {
      this.breadCrumpService.setPageTitle('Đơn đặt hàng');
      this.breadCrumpService.setTitle('Admin - Đơn đặt hàng');
    }
    this.form = new FormGroup({
      paid: new FormControl(0, [Validators.required, Validators.min(0)]),
      customer_id: new FormControl('', [Validators.required]),
      customer_name: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
      note: new FormControl('', []),
      cancel_pending: new FormControl(false),
    });
    this.detailForm = new FormGroup({
      quantity: new FormControl(1, [Validators.required, forbiddenValue(0)]),
      price: new FormControl('', [Validators.required]),
    });
    this.form.controls['paid'].valueChanges.subscribe((e) => {
      if (e === '' || e === null) {
        this.form.controls['paid'].setValue(0);
      }
    });
  }

  ngOnInit(): void {
    if (!this.readonly) {
      this.customerService
        .getList({
          limit: 1000,
          page: 1,
        })
        .subscribe({
          next: (res) => {
            if (res.status == true) {
              this.customers = res.data ?? [];
            }
          },
        });
    }
  }

  loadInvoices(event: LazyLoadEvent) {
    this.loading = true;
    this.invoiceService
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
        customer: this.customer?.id,
      })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.totalRecords = res.meta?.total ?? 0;
            this.invoices = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.loadProductData();
    this.selectedInvoice = undefined;
    this.selectedCustomer = this.customer;
    this.selectedStatus = this.statusOptions[0];
    this.form.reset();
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  save() {
    if (this.form.valid) {
      this.loading = true;
      const value: InsertUpdateInvoiceDto = {
        ...this.form.value,
        status: this.selectedStatus?.value ?? 1,
      };
      if (this.displayAddDialog) {
        this.invoiceService.create(value).subscribe({
          next: async (res) => {
            if (res.status == true) {
              for (const i of this.details) {
                await firstValueFrom(
                  this.invoiceDetalService.create({
                    product_detail_id: i.product_detail_id ?? 0,
                    quantity: i.quantity,
                    invoice_id: res.data ?? 0,
                    price: i.price,
                  })
                );
              }

              this.loadInvoices(this.dt.createLazyLoadMetadata());
              this.formVisible = false;
              this.toastService.addSuccess('Thêm đơn hàng thành công.');
            } else this.loading = false;
          },
        });
      } else {
        if (this.selectedInvoice?.id) {
          this.invoiceService
            .update(this.selectedInvoice?.id, value)
            .subscribe({
              next: async (res) => {
                if (res.status == true) {
                  this.formVisible = false;
                  for (
                    let index = 0;
                    index < this.deleteDetails.length;
                    index++
                  ) {
                    const i = this.deleteDetails[index];

                    await firstValueFrom(this.invoiceDetalService.delete(i));
                  }
                  for (let index = 0; index < this.newDetails.length; index++) {
                    const i = this.newDetails[index];
                    await firstValueFrom(
                      this.invoiceDetalService.create({
                        product_detail_id: i.product_detail_id ?? 0,
                        quantity: i.quantity,
                        invoice_id: res.data ?? 0,
                        price: i.price,
                      })
                    );
                  }
                  this.loadInvoices(this.dt.createLazyLoadMetadata());
                  this.toastService.addSuccess('Lưu thành công.');
                } else this.loading = false;
              },
            });
        }
      }
    } else {
      this.toastService.addError('Vui lòng nhập đủ thông tin!');
    }
  }

  delete(invoice: InvoiceDto) {
    if (this.readonly) {
      if (invoice.cancel_pending) {
        this.confirmationService.confirm({
          header: 'Thông báo',
          rejectVisible: false,
          acceptLabel: 'Xác nhận',
          message: 'Yêu cầu đang được xử lý, vui lòng kiểm tra lại sau',
        });
        return;
      }
      if (invoice?.status && invoice.status >= 4) {
        this.confirmationService.confirm({
          header: 'Thông báo',
          rejectVisible: false,
          acceptLabel: 'Xác nhận',
          message: 'Bạn không thể hủy đơn hàng này.',
        });
        return;
      }
      this.confirmService.confirm(
        `Bạn có chắc chắn muốn yêu cầu hủy đơn đặt hàng?`,
        () => {
          const item: any = { ...invoice };
          item.cancel_pending = true;
          firstValueFrom(this.invoiceService.update(invoice.id, item)).then(
            (res) => {
              if (res?.status) {
                this.loadInvoices(this.dt.createLazyLoadMetadata());
                this.toastService.addSuccess(`Yêu cầu đang được xử lý.`);
              } else {
                this.toastService.addError(
                  `Đơn hàng đang được vận chuyển hoặc đã hoàn tất, không thể hủy.`
                );
              }
            }
          );
        }
      );
    } else {
      this.confirmService.confirm(
        `Bạn có chắc chắn muốn xóa đơn đặt hàng?`,
        () => {
          firstValueFrom(this.invoiceService.delete(invoice.id)).then((res) => {
            if (res?.status) {
              this.loadInvoices(this.dt.createLazyLoadMetadata());
              this.toastService.addSuccess(`Đã xóa đơn đặt hàng.`);
            } else {
              this.toastService.addError(`Xóa đơn đặt hàng thất bại.`);
            }
          });
        }
      );
    }
  }

  showEditDialog(value: InvoiceDto) {
    this.loadProductData();
    this.selectedInvoice = value;
    this.selectedStatus = this.statusOptions.find(
      (st) => st.value == value.status
    );
    if (value.customer_id)
      this.selectedCustomer = this.customers.find(
        (c) => c.id == value.customer_id
      );
    this.form.patchValue(value);
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }

  loadProductData(cache: boolean = true) {
    if (!this.productDetails.length || !cache) {
      this.productDetailService
        .getList({
          page: 1,
          limit: 99999,
          with_detail: true,
        })
        .subscribe((res) => {
          if (res.status == true) {
            this.productDetails = res.data ?? [];
            this.productDetails.forEach((d) => {
              d.name = d.product?.name;
            });
          }
        });
    }
  }

  public deleteDetail(detail: InvoiceDetailDto) {
    this.details.splice(this.details.indexOf(detail), 1);
    if (detail.id) {
      this.deleteDetails.push(detail.id);
      const index = this.newDetails.findIndex(
        (i) => i.product_detail_id == detail.product_detail_id
      );
      if (index >= 0) {
        this.newDetails.splice(index, 1);
      }
    }
    this.total = 0;
    this.calTotal();
  }
  public calTotal() {
    this.total = 0;
    this.details.forEach((i) => (this.total += i.price * i.quantity));
  }
  public addDetail() {
    if (this.detailForm && this.selectedProduct) {
      const price = this.detailForm.value.price;
      const quantity = this.detailForm.value.quantity;
      const itemIndex = this.details.findIndex(
        (d) =>
          d.product_detail_id == this.selectedProduct?.id && d.price == price
      );
      const newDetail = {
        ...this.detailForm.value,
        product_detail_id: this._selectedProduct?.id,
        product_detail: this.selectedProduct,
        total: quantity * price,
      };
      if (itemIndex >= 0) {
        const item = this.details[itemIndex];
        item.quantity += quantity;
        item.total = item.quantity * price;
      } else {
        this.details.push(newDetail);
      }
      const newDetailIndex = this.newDetails.findIndex(
        (d) =>
          d.product_detail_id == this.selectedProduct?.id && d.price == price
      );
      if (newDetailIndex >= 0) {
        const newDetail = this.newDetails[newDetailIndex];
        newDetail.quantity += quantity;
        newDetail.total = newDetail.quantity * price;
      } else {
        this.newDetails.push(newDetail);
      }
      this.calTotal();
    }
  }
}
