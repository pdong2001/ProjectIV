import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOptionTableComponent } from './product-option-table.component';

describe('ProductOptionTableComponent', () => {
  let component: ProductOptionTableComponent;
  let fixture: ComponentFixture<ProductOptionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductOptionTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductOptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
