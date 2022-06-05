import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';
import { Editor } from 'primeng/editor';
import { FileUpload } from 'primeng/fileupload';
import { Image } from 'primeng/image';
import { Table } from 'primeng/table';
import { environment } from 'projects/admin/src/environments/environment';
import { ImageableType } from 'projects/common/src/lib/imageable-type';
import { ConfirmService } from 'projects/common/src/lib/services/confirm.service';
import { ProductService } from 'projects/common/src/lib/services/product.service';
import { TitleService } from 'projects/admin/src/app/services/title.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';
import { BlobDto } from '../../../../../common/src/Contracts/Blob/blob-dto';
import { CategoryDto } from '../../../../../common/src/Contracts/Category/category-dto';
import { ImageAssign } from '../../../../../common/src/Contracts/Common/image';
import { SortMode } from '../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { InsertUpdateProductDto } from '../../../../../common/src/Contracts/Product/insert-update-product-dto';
import { ProductDto } from '../../../../../common/src/Contracts/Product/product-dto';
import { ProductOptionDto } from '../../../../../common/src/Contracts/Product/product-option-dto';
import { CategoryService } from '../../../../../common/src/lib/services/category.service';
import { FileService } from '../../../../../common/src/lib/services/file.service';
import { ProviderService } from 'projects/common/src/lib/services/provider.service';
import { ProviderDto } from 'projects/common/src/Contracts/Provider/provider-dto';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('imagePreview') image!: Image;
  @ViewChild('dt') dt!: Table;
  @ViewChild('editor') editor!: Editor;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  chosingDefaultImage: boolean = false;
  providers : ProviderDto[] =[];
  categories: CategoryDto[] = [];
  products: ProductDto[] = [];
  selectedProducts: ProductDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  selectedProduct!: ProductDto;
  visibleOptions = [
    { label: 'Tất cả', value: false },
    { label: 'Đang hiện thị', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];
  selectedFiles: BlobDto[] = [];

  product: InsertUpdateProductDto = { name: '', visible: true, description: '' };
  nameInvalid: boolean = false;

  displayAddDialog: boolean = false;
  displayEditDialog: boolean = false;
  options: ProductOptionDto[] = [];
  get formVisible(): boolean {
    return this.displayAddDialog || this.displayEditDialog;
  }

  set formVisible(value: boolean) {
    this.displayEditDialog = false;
    this.displayAddDialog = value;
  }

  tabActiveIndex: number = 0;

  constructor(
    private breadCrumpService: TitleService,
    private productService: ProductService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private categoryService: CategoryService,
    private fileService: FileService,
    private providerService:ProviderService
  ) {
    this.breadCrumpService.setPageTitle('Danh sách sản phẩm');
    this.breadCrumpService.setTitle('Admin - Sản phẩm');
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProviders();
  }

  loadProviders()
  {
    this.providerService.getList({
      limit: 100
    }).subscribe(res => {
      if (res.status)
      {
        this.providers = res.data??[];
      }
    })
  }

  loadCategories() {
    this.categoryService
      .getList({
        page: 1,
        limit: 1000,
        visible_only: false,
        search: '',
      })
      .toPromise()
      .then((res) => {
        if (res?.status == true) {
          this.categories = res.data ?? [];
        }
      });
  }

  loadProducts(event: LazyLoadEvent) {
    this.loading = true;
    this.productService
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
        with_detail: false,
        consumeable_only: false,
        with_images: true,
        has_image_only: false,
        visible_only: false,
      })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.totalRecords = res.meta?.total ?? 0;
            this.products = res.data ?? [];
            if (this.categories.length) {
              this.products.forEach((prod) => {
                prod.category = this.categories.find((cate) => {
                  return cate.id == prod.category_id;
                });
              });
            }
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.product = { name: '', visible: true };
    this.displayEditDialog = false;
    this.displayAddDialog = true;
    this.options = [];
  }

  add() {
    if (this.product.name != '' && this.options.length) {
      this.formVisible = false;
      this.product.options = this.options;
      this.loading = true;
      this.productService
        .create(this.product)
        .toPromise()
        .then(async (res) => {
          this.options = [];
          if (res?.status == true) {
            if (res.data != undefined) {
              if (this.tabActiveIndex == 0) {
                for (
                  let index = 0;
                  index < this.fileUpload.files.length;
                  index++
                ) {
                  const file = this.fileUpload.files[index];
                  await this.fileService
                    .createAssign({
                      imageable_id: res.data ?? 0,
                      imageable_type: ImageableType.Product,
                      file: file,
                      name: this.product.name,
                    })
                    .toPromise();
                }
              } else {
                for (
                  let index = 0;
                  index < this.selectedFiles.length;
                  index++
                ) {
                  const blob = this.selectedFiles[index];
                  await this.fileService
                    .createAssign({
                      imageable_id: res.data ?? 0,
                      imageable_type: ImageableType.Product,
                      blob_id: blob.id,
                    })
                    .toPromise();
                }
              }
              this.selectedFiles = [];
              this.fileUpload.clear();
            }
            this.loadProducts(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(
              `Đã thêm ${this.product.name.toLocaleLowerCase()}.`
            );
          } else {
            this.loading = false;
          }
        });
    }
  }

  save() {
    if (this.product.name != '') {
      this.product.options = this.options;
      this.loading = true;
      this.productService
        .update(this.selectedProduct.id, this.product)
        .toPromise()
        .then(async (res) => {
          this.options = [];
          if (res?.status == true) {
            if (this.tabActiveIndex == 0) {
              for (
                let index = 0;
                index < this.fileUpload.files.length;
                index++
              ) {
                const file = this.fileUpload.files[index];
                await this.fileService
                  .createAssign({
                    imageable_id: res.data ?? 0,
                    imageable_type: ImageableType.Product,
                    file: file,
                    name: this.product.name,
                  })
                  .toPromise();
              }
            } else {
              for (let index = 0; index < this.selectedFiles.length; index++) {
                const blob = this.selectedFiles[index];
                if (
                  !this.selectedProduct.images.some(
                    (assign) => assign.blob.id == blob.id
                  )
                ) {
                  await this.fileService
                    .createAssign({
                      imageable_id: res.data ?? 0,
                      imageable_type: ImageableType.Product,
                      blob_id: blob.id,
                    })
                    .toPromise();
                }
              }
              for (
                let index = 0;
                index < this.selectedProduct.images.length;
                index++
              ) {
                const assign = this.selectedProduct.images[index];
                if (!this.selectedFiles.some((b) => b.id == assign.blob.id)) {
                  await this.fileService.deleteAssign(assign.id).toPromise();
                }
              }
            }
            this.selectedFiles = [];
            this.fileUpload.clear();
            this.formVisible = false;
            this.toastService.addSuccess(`Chỉnh sửa ${this.product.name}.`);
            this.loadProducts(this.dt.createLazyLoadMetadata());
          } else {
            this.loading = false;
            if (res?.meta.name) {
              this.nameInvalid = true;
            }
            this.toastService.addError(
              `Chỉnh sửa ${this.product.name.toLocaleLowerCase()} thất bại.`
            );
          }
        });
    }
  }

  delete(prod: ProductDto) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${prod.name}`,
      () => {
        this.productService
          .delete(prod.id)
          .toPromise()
          .then((res) => {
            if (res?.status) {
              this.loadProducts(this.dt.createLazyLoadMetadata());
              this.toastService.addSuccess(`Đã xóa ${prod.name}.`);
            } else {
              this.toastService.addError(
                `Xóa ${prod.name.toLocaleLowerCase()} thất bại.`
              );
            }
          });
      }
    );
  }

  showEditDialog(value: ProductDto) {
    this.selectedProduct = value;
    this.options = value.options;
    this.product = {
      name: value.name,
      code: value.code,
      visible: value.visible,
      provider_id: value.provider_id,
      default_image: value.image?.id,
      category_id: value.category_id,
      description: value.description,
      short_description: value.short_description,
    };
    this.selectedFiles = value.images?.map((assign) => assign.blob)??[];
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }

  deleteFile(assign: ImageAssign) {
    this.confirmService.confirm(
      'Bạn có thật sự muốn xóa ảnh này khỏi sản phẩm?\nẢnh vẫn sẽ được lưu lại trong kho ảnh.',
      () => {
        this.fileService
          .deleteAssign(assign.id)
          .toPromise()
          .then((res) => {
            if (res?.status) {
              this.loadProducts(this.dt.createLazyLoadMetadata());
            }
          });
      },
      'Xác nhận'
    );
  }

  setDefaultImage(prod: ProductDto, blob: BlobDto) {
    this.confirmService.confirm(
      'Bạn có thật sự muốn thay đổi ảnh đại diện cho sản phẩm?',
      () => {
        this.selectedProduct = prod;
        this.product = {
          name: prod.name,
          code: prod.code,
          visible: prod.visible,
          provider_id: prod.provider_id,
          default_image: blob.id,
          category_id: prod.category_id,
          description: prod.description,
          short_description: prod.short_description,
        };
        this.selectedFiles = prod.images.map((assign) => assign.blob);
        this.save();
      },
      'Xác nhận'
    );
  }

  addNewOption(name: string) {
    this.options.push({
      name: name,
      product_id: this.selectedProduct?.id,
    });
  }
}
