import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LazyLoadEvent } from 'primeng/api';
import { Editor } from 'primeng/editor';
import { Table } from 'primeng/table';
import { environment } from 'projects/admin/src/environments/environment';
import { ImageableType } from 'projects/common/src/lib/imageable-type';
import { CategoryDto } from '../../Contracts/Category/category-dto';
import { SortMode } from '../../Contracts/Common/paged-and-sorted-request';
import { InsertUpdateProductDto } from '../../Contracts/Product/insert-update-product-dto';
import { ProductDto } from '../../Contracts/Product/product-dto';
import { CategoryService } from '../../services/category.service';
import { ConfirmService } from '../../services/confirm.service';
import { FileService } from '../../services/file.service';
import { ProductService } from '../../services/product.service';
import { TitleService } from '../../services/title.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @ViewChild('editor') editor!: Editor;
  getFilePath(value: string) {
    if (!value) return '';
    return environment.FILE_GET_BY_NAME + value;
  }
  providers = [];
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

  product: InsertUpdateProductDto = { name: '', visible: true };
  newImages: { file: File; URL: any }[] = [];
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

  getSafeHTML(value: string) {
    if (!value) return '';
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  constructor(
    private breadCrumpService: TitleService,
    private productService: ProductService,
    private toastService: ToastService,
    private confirmService: ConfirmService,
    private categoryService: CategoryService,
    private sanitizer: DomSanitizer,
    private fileService: FileService
  ) {
    this.breadCrumpService.setPageTitle('Danh sách sản phẩm');
    this.breadCrumpService.setTitle('Admin - Sản phẩm');
  }

  ngOnInit(): void {
    this.loadCategories();
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
        with_images: true
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
  }

  add() {
    if (this.product.name != '') {
      this.formVisible = false;
      this.loading = true;
      this.productService
        .create(this.product)
        .toPromise()
        .then(async (res) => {
          if (res?.status == true) {
            if (res.data != undefined) {
              for (let index = 0; index < this.newImages.length; index++) {
                const file = this.newImages[index];
                await this.fileService.createAssign({
                  imageable_id: res.data??0,
                  imageable_type: ImageableType.Product,
                  file: file.file
                }).toPromise();
              };
            }
            this.loadProducts(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(
              `Đã thêm ${this.product.name.toLocaleLowerCase()}.`
            );
          }
        });
    }
  }

  save() {
    if (this.product.name != '') {
      this.loading = true;
      this.productService
        .update(this.selectedProduct.id, this.product)
        .toPromise()
        .then(async (res) => {
          if (res?.status == true) {
            for (let index = 0; index < this.newImages.length; index++) {
              const file = this.newImages[index];
              await this.fileService.createAssign({
                imageable_id: res.data??0,
                imageable_type: ImageableType.Product,
                file: file.file
              }).toPromise();
            };
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
    this.product = {
      name: value.name,
      code: value.code,
      visible: value.visible,
      provider_id: value.provider_id,
      default_image: value.default_image?.id,
      category_id: value.category_id,
      description: value.description,
    };
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }

  async fileInput(e: any) {
    for (let index = 0; index < e.files.length; index++) {
      const file: File = e.files[index];
      if (file.size > 150000) {
        this.toastService.addError('Ảnh có kích thước quá lớn!');
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (_event) => {
          this.newImages.push({ file: file, URL: reader.result });
        };
      }
    }
    e.value = '';
  }

  deleteFile(file: any) {
    var index = this.newImages.indexOf(file);
    delete this.newImages[index];
    this.newImages.splice(index, 1);
  }
}
