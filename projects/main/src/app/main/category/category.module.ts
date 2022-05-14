import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';
import { ProductComponent } from './product/product.component';
import { SliderModule } from 'primeng/slider';
import { PaginatorModule } from 'primeng/paginator';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { environment } from 'projects/main/src/environments/environment';
import { DialogModule } from 'primeng/dialog';
import { ComponentsModule } from '../../shared/components/components.module';

@NgModule({
  declarations: [CategoryComponent, ProductComponent],
  imports: [
    CommonModule,
    DataViewModule,
    CategoryRoutingModule,
    SliderModule,
    PaginatorModule,
    ButtonModule,
    InputTextModule,
    ImageModule,
    CommonPipeModule.forRoot(environment),
    DialogModule,
    ComponentsModule
  ],
})
export class CategoryModule {}
