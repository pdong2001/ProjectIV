import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'projects/admin/src/environments/environment';
import { SortMode } from 'projects/common/src/Contracts/Common/paged-and-sorted-request';
import { ProductDto } from 'projects/common/src/Contracts/Product/product-dto';
import { ProductService } from 'projects/common/src/services/product.service';
declare var layoutInit:any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  trendingProds: ProductDto[] = [];
  init : boolean = false;
  constructor(private productService : ProductService) { }
  ngAfterViewChecked(): void {
    if (this.init)
    {
      layoutInit();
      this.init = false;
    }
  }

  public getFilePath(name:string | undefined)
  {
    return name ? environment.FILE_DOWNLOAD_BY_NAME + name : '';
  }

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct()
  {
    this.productService.getList({
      limit: 6,
      page : 1,
      with_detail: false,
      with_images : false,
      search: '',
      column : 'created_at',
      sort : SortMode.DESC,
      consumeable_only : false
    }).subscribe(res => {
      if (res.status)
      {
        if (res.data)
        {
          while (res.data?.length < 6)
          {
            res.data = res.data?.concat(res.data);
          }
        }
        this.trendingProds = res.data??[];
      }
      this.init = true;
    });
    
  }
 
}
