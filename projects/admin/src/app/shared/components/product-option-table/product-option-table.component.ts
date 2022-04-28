import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductOptionDto } from '../../../../../../common/src/Contracts/Product/product-option-dto';

@Component({
  selector: 'app-product-option-table',
  templateUrl: './product-option-table.component.html',
  styleUrls: ['./product-option-table.component.css'],
})
export class ProductOptionTableComponent implements OnInit {
  @Input() set options(value: ProductOptionDto[]) {
    this._options = value;
  }
  private _options: ProductOptionDto[] = [];
  public get options(): ProductOptionDto[] {
    return this._options;
  }

  @Output() optionsChange: EventEmitter<ProductOptionDto[]> = new EventEmitter<
    ProductOptionDto[]
  >();
  @Input() readonly: boolean = false;
  @Input() deletable : boolean = true;
  constructor() {}
  clonedOption: ProductOptionDto | undefined;

  ngOnInit(): void {}
  onRowEditInit(option: ProductOptionDto) {
    this.clonedOption = { ...option };
  }

  onRowEditSave(option: ProductOptionDto) {
    this.optionsChange.emit(this.options);
    delete this.clonedOption;
  }

  onRowEditCancel(index: number) {
    if (this.clonedOption) this.options[index] = this.clonedOption;
  }

  deleteRow(option:ProductOptionDto)
  {
    this.options.splice(this.options.indexOf(option), 1);
    this.optionsChange.emit(this.options);
  }
}
