import { Injectable } from '@angular/core';
import { InsertUpdateProductDetailDto } from '../Contracts/ProductDetail/insert-update-product-detail-dto';
import { ProductDetailDto } from '../Contracts/ProductDetail/product-detail-dto';
import { ProductDetailLookUpDto } from '../Contracts/ProductDetail/product-detail-look-up-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailService extends CRUDService<ProductDetailDto, InsertUpdateProductDetailDto, ProductDetailLookUpDto> {
  protected override controller: string = 'admin/product-details';
  constructor(httpService:HttpService) { super(httpService); }
}
