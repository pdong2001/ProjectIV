import { Injectable } from '@angular/core';
import { CategoryDto } from '../../Contracts/Category/category-dto';
import { CategoryLookUpDto } from '../../Contracts/Category/category-look-up-dto';
import { InsertUpdateCategoryDto } from '../../Contracts/Category/insert-update-category-dto';
import { CRUDService } from './crudservice';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CRUDService<CategoryDto, InsertUpdateCategoryDto, CategoryLookUpDto> {
  protected override controller: string = 'admin/categories';
  constructor(httpClient:HttpService){
    super(httpClient);
  }
}
