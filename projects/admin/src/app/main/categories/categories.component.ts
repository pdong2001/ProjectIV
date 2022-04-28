import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { CategoryDto } from '../../../../../common/src/Contracts/Category/category-dto';
import { SortMode } from '../../../../../common/src/Contracts/Common/paged-and-sorted-request';
import { TitleService } from '../../services/title.service';
import { CategoryService } from '../../../../../common/src/services/category.service';
import { InsertUpdateCategoryDto } from '../../../../../common/src/Contracts/Category/insert-update-category-dto';
import { Table } from 'primeng/table';
import { ConfirmService } from 'projects/common/src/services/confirm.service';
import { ToastService } from 'projects/common/src/services/toast.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  categories: CategoryDto[] = [];
  selectedCategories: CategoryDto[] = [];
  totalRecords: number = 0;
  selectAll: boolean = false;
  loading: boolean = true;
  selectedCategory!: CategoryDto;
  visibleOptions = [
    { label: 'Tất cả', value: false },
    { label: 'Đang hiện thị', value: true },
  ];

  selectedVisibleOption = this.visibleOptions[0];

  category: InsertUpdateCategoryDto = { name: '', visible: true };
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
    private categoryService: CategoryService,
    private toastService: ToastService,
    private confirmService: ConfirmService
  ) {
    this.breadCrumpService.setPageTitle('Loại sản phẩm');
    this.breadCrumpService.setTitle('Admin - Loại sản phẩm');
  }

  ngOnInit(): void {}

  loadCategories(event: LazyLoadEvent) {
    this.loading = true;
    this.categoryService
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
        visible_only: this.selectedVisibleOption.value,
      })
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.totalRecords = res.meta?.total ?? 0;
            this.categories = res.data ?? [];
          }
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  showAddDialog() {
    this.category = { name: '', visible: true };
    this.displayEditDialog = false;
    this.displayAddDialog = true;
  }

  add() {
    if (this.category.name != '') {
      this.formVisible = false;
      this.loading = true;
      this.categoryService
        .create(this.category)
        .toPromise()
        .then((res) => {
          if (res?.status == true) {
            this.loadCategories(this.dt.createLazyLoadMetadata());
            this.toastService.addSuccess(`Đã thêm ${this.category.name}.`);
          }
        });
    }
  }

  save() {
    if (this.category.name != '') {
      if (
        this.category.name != this.selectedCategory.name ||
        this.selectedCategory.visible != this.category.visible
      ) {
        this.loading = true;
        this.categoryService
          .update(this.selectedCategory.id, this.category)
          .toPromise()
          .then((res) => {
            if (res?.status == true) {
              this.formVisible = false;
              this.toastService.addSuccess(`Chỉnh sửa ${this.category.name}.`);
              this.loadCategories(this.dt.createLazyLoadMetadata());
            } else {
              this.loading = false;
              if (res?.meta.name) {
                this.nameInvalid = true;
              }
              this.toastService.addError(
                `Chỉnh sửa ${this.category.name} thất bại.`
              );
            }
          });
      } else {
        this.formVisible = false;
        this.toastService.addSuccess(`Chỉnh sửa ${this.category.name}.`);
      }
    }
  }

  delete(cate: CategoryDto) {
    this.confirmService.confirm(
      `Bạn có chắc chắn muốn xóa ${cate.name}`,
      () => {
        this.categoryService
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

  showEditDialog(value: CategoryDto) {
    this.selectedCategory = value;
    this.category = { name: value.name, visible: value.visible ?? true };
    this.displayEditDialog = true;
    this.displayAddDialog = false;
  }
}
