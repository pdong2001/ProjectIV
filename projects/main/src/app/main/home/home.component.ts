import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
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
  public settings: WebInfoDto[] = [];
  trendingProds: ProductDto[] = [];
  init: boolean = true;
  slides: WebInfoDto[] = [];
  public infoType = InfoType;
  public loadedTrending = false;
  public loadedSettings = false;
  constructor(
    private productService: ProductService,
    private webInfoService: WebInfoService,
    private router: Router
  ) {}

  ngAfterViewChecked(): void {
    if (this.loadedSettings && this.loadedTrending && this.init) {
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

  public getSettings(name: string) {
    return this.settings.filter((s) => s.name == name);
  }

  public getOne(name: string) {
    return this.settings.find((s) => s.name == name);
  }

  public loadInfo() {
    this.webInfoService.getList({}).subscribe({
      next: (res) => {
        if (res.status == true && res.data) {
          this.settings = res.data;
          this.slides = this.getSettings(this.infoType.Slide);
        }
        this.loadedSettings = true;
      },
    });
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
        this.loadedTrending = true;
      });
  }
  searchProduct(search: string) {
    const url = this.router.createUrlTree(['/category'], {
      queryParams: {
        s: search,
      },
    });
    this.router.navigateByUrl(url);
  }
}
