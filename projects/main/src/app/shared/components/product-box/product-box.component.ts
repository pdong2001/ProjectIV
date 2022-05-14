import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CategoryDto } from 'projects/common/src/Contracts/Category/category-dto';
import { ProductDto } from 'projects/common/src/Contracts/Product/product-dto';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css']
})
export class ProductBoxComponent implements OnInit {

  @Input('value') product! : ProductDto;
  @Input('style') style : any;
  @Output() categoryChange : EventEmitter<CategoryDto | undefined> = new EventEmitter<CategoryDto | undefined>();
  @Output() addCartClick : EventEmitter<ProductDto> = new EventEmitter<ProductDto>();
  
  constructor() { }

  ngOnInit(): void {
  }  
  selectedCategoryChange(category: CategoryDto | undefined)
  {
    this.categoryChange.emit(category);
  }
  showAddCartDialog()
  {
    this.addCartClick.emit(this.product);
  }
}
