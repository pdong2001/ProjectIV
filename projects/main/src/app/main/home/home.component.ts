import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'projects/admin/src/environments/environment';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { ProductDto } from 'projects/common/src/Contracts/Product/product-dto';
import { InfoType } from 'projects/common/src/Contracts/WebInfo/info-type.enum';
import { WebInfoDto } from 'projects/common/src/Contracts/WebInfo/webinfo-dto';
import { ProductService } from 'projects/common/src/lib/services/product.service';
import { WebInfoService } from 'projects/common/src/lib/services/web-info.service';
declare var layoutInit: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewChecked {
  trendingProds: ProductDto[] = [];
  init: boolean = false;
  slides: WebInfoDto[] = [];
  constructor(
    private productService: ProductService,
    private webInfoService: WebInfoService,
    private router : Router
  ) {}

  ngAfterViewChecked(): void {
    if (this.init) {
      layoutInit();
      this.init = false;
    }
  }

  public getFilePath(name: string | undefined) {
    return name ? environment.FILE_DOWNLOAD_BY_NAME + name : '';
  }

  ngOnInit(): void {
    this.loadInfo();
    this.loadProduct();
  }

  public loadInfo()
  {
    this.webInfoService.getList({
      name : InfoType.Slide
    })
    .subscribe({
      next : res => {
        if (res.status == true && res.data)
        {
          this.slides = res.data;
        }
      }
    })
  }

  loadProduct() {
    this.productService
      .getList({
        limit: 8,
        page: 1,
        with_detail: false,
        with_images: false,
        search: '',
        column: 'created_at',
        sort: SortMode.DESC,
        consumeable_only: false,
        visible_only: true,
        has_image_only: true,
        min_price: 0,
        max_price: 0,
      })
      .subscribe((res) => {
        if (res.status) {
          if (res.data) {
            while (res.data?.length < 8) {
              res.data = res.data?.concat(res.data);
            }
          }
          this.trendingProds = res.data ?? [];
        }
        this.init = true;
      });
  }
  searchProduct(search : string)
  {
    const url = this.router.createUrlTree(['/category'],
    {
      queryParams : {
        s : search
      }
    })
    this.router.navigateByUrl(url);
  }
}
