import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BlobDto } from 'projects/common/src/Contracts/Blob/blob-dto';
import { ProductDto } from 'projects/common/src/Contracts/Product/product-dto';
import { ProductDetailDto } from 'projects/common/src/Contracts/ProductDetail/product-detail-dto';
import { ProductDetailOptionValueDto } from 'projects/common/src/Contracts/ProductDetail/product-detail-option-value-dto';
import { CartService } from 'projects/common/src/lib/services/cart.service';
import { ProductDetailService } from 'projects/common/src/lib/services/product-detail.service';
import { ProductService } from 'projects/common/src/lib/services/product.service';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.css'],
})
export class ProductInfoComponent implements OnInit {
  @Output('valueChange') productChange: EventEmitter<ProductDto> =
    new EventEmitter<ProductDto>();
  @Input('value') public set product(value: ProductDto) {
    this._product = value;
    if (
      this._product.details == undefined ||
      this._product.details.length == 0
    ) {
      this.loadProductData();
    }
  }
  @Input() public relatedVisible = true;
  private _product!: ProductDto;
  quantity: number = 1;
  public get product(): ProductDto {
    return this._product;
  }
  private _selectedProducttDetail: ProductDetailDto | undefined;
  public get selectedProductDetail(): ProductDetailDto | undefined {
    return this._selectedProducttDetail;
  }
  public set selectedProductDetail(value: ProductDetailDto | undefined) {
    this._selectedProducttDetail = value;
    if (value?.default_image) {
      this.activeImageIndex = this.product.images.findIndex((img) => {
        const image = value.image as any;
        return img.blob.id == image.id;
      });
    }
  }
  private _activeImageIndex: number = 0;
  public get activeImageIndex(): number {
    return this._activeImageIndex;
  }
  public set activeImageIndex(value: number) {
    this._activeImageIndex = value;
  }
  options: { [index: string]: ProductDetailOptionValueDto[] } = {};
  public loading = false;
  public selectedOptions: ProductDetailOptionValueDto[] = [];
  public Object = Object;
  public checkSelected(
    selectedOptions: ProductDetailOptionValueDto[],
    value: ProductDetailOptionValueDto
  ) {
    return selectedOptions.some(
      (v) => v.option_id == value.option_id && v.value == value.value
    );
  }
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {}

  renewData() {
    this.quantity = 1;
    this.loading = true;
    this.options = {};
    this.selectedProductDetail = undefined;
    this.selectedOptions = [];
  }

  loadRelatedProduct() {}

  loadProductData() {
    this.renewData();
    this.productService.get(this._product.id).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this._product = res.data;
          this._product.options.forEach((opt) => {
            if (this._product.details) {
              this.options[opt.name] = this._product.details
                ?.map(
                  (detail) =>
                    detail.options.find(
                      (optValue) => optValue.option_id == opt.id
                    ) ?? {}
                )
                .filter((optValue) => optValue != {});
              this.options[opt.name].forEach((optValue, index, list) => {
                if (
                  list.some((oV, i) => {
                    return oV.value == optValue.value && index != i;
                  })
                ) {
                  list.splice(index, 1);
                }
              });
            }
          });
          this.productChange.emit(this.product);
        }
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  public addToCart() {
    if (this.selectedProductDetail) {
      const request = this.cartService.create({
        product_detail_id: this.selectedProductDetail.id,
        quantity: this.quantity,
      });
      if (request instanceof Observable) {
        firstValueFrom(request);
      }
    }
  }

  public selectOption(value: ProductDetailOptionValueDto) {
    // Kiểm tra lựa chọn đã được chọn hay chưa
    const optionName = value.name;
    const existsIndex = this.selectedOptions.findIndex(
      (v) => v.option_id == value.option_id && v.value == value.value
    );
    if (existsIndex >= 0) {
      // Xóa nếu chọn lại lựa chọn đã được chọn
      this.selectedOptions.splice(existsIndex, 1);
    } else {
      const index = this.selectedOptions.findIndex(
        (v) => v.option_id == value.option_id
      );
      if (index >= 0) {
        this.selectedOptions[index] = value;
      } else {
        this.selectedOptions.push(value);
      }
    }
    // Tìm kiếm những chi tiết phù hợp
    const details = this.product.details?.filter((prod) => {
      return prod.options.some(
        (opt) =>
          this.selectedOptions.some((selected) => {
            return (
              opt.option_id == selected.option_id &&
              (opt.value == selected.value || existsIndex >= 0)
            );
          }) || this.selectedOptions.length == 0
      );
    });
    for (const key in this.options) {
      if (key != optionName) {
        this.options[key] =
          details?.map(
            (prod) =>
              prod.options.find((optValue) => optValue.name == key) ?? {}
          ) ?? [];
      }
    }

    // Lấy những options phù hợp
    for (const key in this.options) {
      this.options[key].forEach((optValue, index, list) => {
        if (
          list.some((oV, i) => {
            return oV.value == optValue.value && index != i;
          })
        ) {
          list.splice(index, 1);
        }
      });
    }
    if (
      this.selectedOptions.length == this.product.options.length &&
      this.product?.details != undefined
    ) {
      for (let index = 0; index < this.product.details.length; index++) {
        const detail = this.product.details[index];
        let match = true;
        this.selectedOptions.forEach((selectedOpt) => {
          match = detail.options.some(
            (opt) =>
              selectedOpt.option_id == opt.option_id &&
              selectedOpt.value == opt.value
          );
        });
        if (match) {
          this.selectedProductDetail = detail;
          if (
            this.quantity >
            (this.selectedProductDetail?.remaining_quantity ?? 0)
          )
            this.quantity = 0;
          break;
        }
      }
    } else {
      this.selectedProductDetail = undefined;
    }
  }

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}
