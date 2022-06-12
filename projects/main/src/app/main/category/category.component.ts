import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DataView } from 'primeng/dataview';
import { environment } from 'projects/admin/src/environments/environment';
import { CategoryDto } from 'projects/common/src/Contracts/Category/category-dto';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { ProductDto } from 'projects/common/src/Contracts/Product/product-dto';
import { CategoryService } from 'projects/common/src/lib/services/category.service';
import { ProductService } from 'projects/common/src/lib/services/product.service';

declare var layoutInit: any;

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {
  @ViewChild(DataView) dv!: DataView;
  public categories: CategoryDto[] = [];
  public products: ProductDto[] = [];
  public totalProducts: number = 0;
  public maxTotalProducts: number = 0;
  public rangeValues: number[] = [0, 9999000];
  public loading: boolean = false;
  public displayAddCartDialog = false;
  public search: string | undefined;
  public selectedCategory: CategoryDto | undefined;
  public maxPrice = 9999000;
  public sortOrder: { sort: SortMode; column: string; display: string }[] = [
    { sort: SortMode.ACS, column: 'min_price', display: 'Giá tăng dần' },
    { sort: SortMode.DESC, column: 'min_price', display: 'Giá giảm dần' },
  ];
  private _selectedOrder:
    | { sort: SortMode; column: string; display: string }
    | undefined;
  selectedProduct: ProductDto | undefined;
  public get selectedOrder():
    | { sort: SortMode; column: string; display: string }
    | undefined {
    return this._selectedOrder;
  }
  public set selectedOrder(
    value: { sort: SortMode; column: string; display: string } | undefined
  ) {
    this._selectedOrder = value;
    this.loadNewData();
  }
  constructor(
    private categoryService: CategoryService,
    private productService: ProductService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  public getSafeHTML(html: string | undefined) {
    if (html) return this.sanitizer.bypassSecurityTrustHtml(html);
    return '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const search = params['s'];
      if (search) {
        this.search = search;
        console.log(search)
        this.selectedCategory = undefined;
        this.loadNewData();
      }
    });
    this.loadCategories();
  }

  public getFilePath(file_path: string | undefined) {
    if (file_path) return environment.FILE_GET_BY_NAME + file_path;
    return '';
  }

  whenLoadComplete = () => {};
  loadCategories() {
    this.categoryService
      .getList({
        visible_only: true,
        limit: 10,
        page: 1,
      })
      .subscribe({
        next: (res) => {
          if (res.status == true) {
            this.categories = res.data ?? [];
          }
        },
      });
  }

  loadProducts(e: any) {
    this.loading = true;
    if (!e) e = {first : 0, rows: 9, }
    this.productService
      .getList({
        page: e.first / e.rows + 1,
        limit: e.rows,
        search: this.search,
        column: this.selectedOrder?.column,
        sort: this.selectedOrder?.sort,
        with_detail: false,
        with_images: false,
        has_image_only: false,
        consumeable_only: false,
        category: this.selectedCategory?.id,
        min_price: this.rangeValues[0],
        max_price: this.rangeValues[1],
      })
      .subscribe({
        next: (res) => {
          if (res.status == true) {
            this.totalProducts = res.meta.total;
            if (this.maxTotalProducts == 0)
              this.maxTotalProducts = res.meta.total;
            this.products = res.data ?? [];
            if (res.meta?.maxPrice) {
              this.maxPrice = res.meta.maxPrice;
              if (this.rangeValues[1] > this.maxPrice)
                this.rangeValues[1] = this.maxPrice;
            }
            if (this.selectedCategory) {
              this.selectedCategory.product_count = res.meta.total;
            } else {
              this.maxTotalProducts = res.meta.total;
            }
          }
        },
        complete: () => {
          this.loading = false;
          this.whenLoadComplete();
        },
      });
  }

  public loadNewData() {
    if (this.loading) {
      this.whenLoadComplete = () => {
        this.loadProducts(this.dv?.createLazyLoadMetadata());
        this.whenLoadComplete = () => {};
      };
    } else {
      this.loadProducts(this.dv?.createLazyLoadMetadata());
    }
  }

  public selectedCategoryChange(e: any, cate: CategoryDto | undefined) {
    e?.preventDefault();
    this.selectedCategory = cate;
    this.loadNewData();
  }

  public searchFormSubmit(value: string) {
    this.router.navigate(['/', 'category'], { queryParams: { s: value } });
  }

  public showAddCartDialog(prod: ProductDto) {
    this.selectedProduct = prod;
    this.displayAddCartDialog = true;
  }
}
