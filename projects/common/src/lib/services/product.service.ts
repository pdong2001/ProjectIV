import { Injectable } from '@angular/core';
import { InsertUpdateProductDto } from '../../Contracts/Product/insert-update-product-dto';
import { ProductDto } from '../../Contracts/Product/product-dto';
import { ProductLookUpDto } from '../../Contracts/Product/product-look-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CRUDService<ProductDto, InsertUpdateProductDto, ProductLookUpDto> {

  protected override controller: string = 'admin/products';
  constructor(httpClient : HttpService) { super(httpClient); }
}
