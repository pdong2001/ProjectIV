import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';
import { Editor } from 'primeng/editor';
import { Image } from 'primeng/image';
import { Table } from 'primeng/table';
import { environment } from 'projects/admin/src/environments/environment';
import { ImageableType } from 'projects/common/src/lib/imageable-type';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { ProductService } from 'projects/common/src/lib/services/product.service';
import { TitleService } from 'projects/admin/src/app/services/title.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { firstValueFrom } from 'rxjs';
import { BlobDto } from '../../../../../common/src/Contracts/Blob/blob-dto';
import { ImageAssign } from '../../../../../common/src/Contracts/Common/image';
import { SortMode } from '../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { ProductDto } from '../../../../../common/src/Contracts/Product/product-dto';
import { InsertUpdateProductDetailDto } from '../../../../../common/src/Contracts/ProductDetail/insert-update-product-detail-dto';
import { ProductDetailDto } from '../../../../../common/src/Contracts/ProductDetail/product-detail-dto';
import { ProductDetailOptionValueDto } from '../../../../../common/src/Contracts/ProductDetail/product-detail-option-value-dto';
import { FileService } from '../../../../../common/src/lib/services/file.service';
import { ProductDetailService } from '../../../../../common/src/lib/services/product-detail.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild('imagePreview') image!: Image;
  @ViewChild('dt') dt!: Table;
  @ViewChild('editor') editor!: Editor;
  selectedProductDetail!: ProductDetailDto;
  files: BlobDto[] = [];
  chosingDefaultImage: boolean = false;
  products: ProductDto[] = [];
  productDetails: ProductDetailDto[] = [];
  selectedProductDetails: ProductDetailDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  private _selectedProduct: ProductDto | undefined;
  public get selectedProduct(): ProductDto | undefined {
    return this._selectedProduct;
  }
  public set selectedProduct(value: ProductDto | undefined) {
    this._selectedProduct = value;
    if (value) {
      this.options = value.options.map((opt) => {
        return {
          option_id: opt.id,
          option: opt,
          value: this.selectedProductDetail?.options.find(
            (v) => v.option_id == opt.id
          )?.value,
        };
      });
    }
  }
  visibleOptions = [
    { label: 'T???t c???', value: false },
    { label: '??ang hi???n th???', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];
  selectedFiles: BlobDto[] = [];

  newImages: File[] = [];
  nameInvalid: boolean = false;

  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  options: ProductDetailOptionValueDto[] = [];
  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = value;
  }

  tabActiveIndex: number = 0;

  formGroup: FormGroup;

  constructor(
    private breadCrumpService: TitleService,
    private productService: ProductService,
    private productDetailService: ProductDetailService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private sanitizer: DomSanitizer,
    private fileService: FileService,
    formBuilder: FormBuilder
  ) {
    this.breadCrumpService.setPageTitle('Danh s??ch chi ti???t s???n ph???m');
    this.breadCrumpService.setTitle('Admin - Chi ti???t s???n ph???m');
    this.formGroup = formBuilder.group(
      {
        remaining_quantity: [0, [Validators.required, Validators.min(0)]],
        visible: [true, [Validators.required]],
        unit: ['', [Validators.required]],
        in_price: [0, [Validators.required, Validators.min(0)]],
        out_price: [0, [Validators.required, Validators.min(0)]],
        total_quantity: [0, [Validators.required, Validators.min(0)]],
      },
      {
        updateOn: 'change',
      }
    );
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(search?: string) {
    this.productService
      .getList({
        limit: 0,
        page: 1,
        column: 'id',
        sort: SortMode.DESC,
        search: search ?? '',
        consumeable_only: false,
        with_detail: false,
        with_images: false,
        has_image_only: false,
        visible_only: false
      })
      .subscribe({
        next: (res) => {
          if (res.status == true) {
            if (res.meta.total > 0) {
              this.productService
                .getList({
                  limit: res.meta.total,
                  page: 1,
                  column: 'id',
                  sort: SortMode.DESC,
                  search: search ?? '',
                  consumeable_only: false,
                  with_detail: false,
                  with_images: false,
                  has_image_only: false,
                  visible_only: false
                })
                .subscribe({
                  next: (res) => {
                    if (res.status == true) {
                      this.totalRecords = res.meta?.total ?? 0;
                      this.products = res.data ?? [];
                    }
                  },
                  complete: () => {},
                });
            } else {
              this.totalRecords = 0;
              this.products = [];
            }
          }
        },
        complete: () => {},
      });
  }

  loadProductDetails(event: LazyLoadEvent) {
    this.loading = true;
    this.productDetailService
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
        consumeable_only: false,
        with_detail: true,
      })
      .subscribe({
        next: (res) => {
          if (res.status == true) {
            this.totalRecords = res.meta?.total ?? 0;
            this.productDetails = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.formGroup.reset();
    this.formGroup.controls['visible'].setValue(true);
    this.selectedFiles = [];
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  async save() {
    if (this.formGroup.valid && this.selectedProduct?.id) {
      const productDetail: InsertUpdateProductDetailDto = {
        ...this.formGroup.value,
      };
      if (this.selectedProduct.id)
        productDetail.product_id = this.selectedProduct.id;
      productDetail.options = this.options.map((opt) => {
        return {
          value: opt.value,
          option_id: opt.option_id,
        };
      });
      this.loading = true;
      if (this.tabActiveIndex == 0 && this.newImages.length > 0) {
        const file = this.newImages[0];
        await firstValueFrom(this.fileService.createAssign({
          imageable_id : this.selectedProduct.id,
          imageable_type: ImageableType.Product,
          file: file
        })).then(
          (res) => {
            if (res.status) {
              productDetail.default_image = res.data?.blob.id;
            }
          }
        );
      } else if (this.tabActiveIndex == 1 && this.selectedFiles.length > 0) {
        productDetail.default_image = this.selectedFiles[0].id;
      }

      if (this.displayEditDialog) {
        this.productDetailService
          .update(this.selectedProductDetail.id, productDetail)
          .subscribe(async (res) => {
            if (res?.status == true) {
              if (this.tabActiveIndex == 0) {
              }
              this.formVisible = false;
              this.toastService.addSuccess(
                `Ch???nh s???a ${productDetail.option_name?.toLocaleLowerCase()} v???i gi?? tr??? l?? ${productDetail.option_value?.toLocaleLowerCase()} th??nh c??ng.`
              );
              this.loadProductDetails(this.dt.createLazyLoadMetadata());
            } else {
              this.loading = false;
              this.toastService.addError(
                `Ch???nh s???a ${productDetail.option_name?.toLocaleLowerCase()} v???i gi?? tr??? l?? ${productDetail.option_value?.toLocaleLowerCase()} th???t b???i.`
              );
            }
          });
      } else {
        this.productDetailService.create(productDetail).subscribe((res) => {
          if (res?.status == true) {
            this.formVisible = false;
            this.loadProductDetails(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(
              `???? th??m ${productDetail.option_name?.toLocaleLowerCase()} v???i gi?? tr??? l?? ${
                productDetail.option_value
              }.`
            );
          } else {
            this.loading = false;
            this.toastService.addError(
              `Th??m ${productDetail.option_name?.toLocaleLowerCase()} v???i gi?? tr??? l?? ${productDetail.option_value?.toLocaleLowerCase()} th???t b???i.`
            );
          }
        });
      }
    }
  }

  delete(prod: ProductDetailDto) {
    this.confirmService.confirm(
      `B???n c?? ch???c ch???n mu???n x??a chi ti???t s???n ph???m?`,
      () => {
        this.productDetailService.delete(prod.id).subscribe((res) => {
          if (res?.status) {
            this.loadProductDetails(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(`X??a chi ti???t s???n ph???m th??nh c??ng.`);
          } else {
            this.toastService.addError(`X??a chi ti???t s???n ph???m th???t b???i.`);
          }
        });
      }
    );
  }

  showEditDialog(value: ProductDetailDto) {
    this.selectedProductDetail = value;
    this.options = value.options;
    this.selectedFiles = [];
    this.formGroup.patchValue({ ...value });
    if (value.product_id) {
      this.selectedProduct = this.products.find(
        (p) => p.id == value.product_id
      );
    } else if (value.product?.id) {
      this.selectedProduct = this.products.find(
        (p) => p.id == value.product?.id
      );
    }
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }

  async fileInput(e: any) {
    for (let index = 0; index < e.files.length; index++) {
      const file: File = e.files[index];
      if (file.size > 5000000) {
        this.toastService.addError('???nh c?? k??ch th?????c qu?? l???n!');
      } else {
        this.newImages.push(file);
      }
    }
    e.value = '';
  }

  deleteFile(assign: ImageAssign) {
    this.confirmService.confirm(
      'B???n c?? th???t s??? mu???n x??a ???nh n??y kh???i s???n ph???m?\n???nh v???n s??? ???????c l??u l???i trong kho ???nh.',
      () => {
        this.fileService.deleteAssign(assign.id).subscribe((res) => {
          if (res?.status) {
            this.loadProductDetails(this.dt.createLazyLoadMetadata());
          }
        });
      },
      'X??c nh???n'
    );
  }

  calculateProductDetailTotal(id: number) {
    return this.productDetails.filter((v) => v.product?.id == id).length;
  }

  setDefaultImage(prodDetail: ProductDetailDto, blob: BlobDto) {}
}
