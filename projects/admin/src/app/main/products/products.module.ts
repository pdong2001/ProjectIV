import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CardModule } from 'primeng/card';
import { EditorModule } from 'primeng/editor';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ComponentsModule } from '../../shared/components/components.module';
import { ImageModule } from 'primeng/image';
import { ProductDetailComponent } from './product-detail/product-detail.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    RippleModule,
    DropdownModule,
    FormsModule,
    ToolbarModule,
    DialogModule,
    InputSwitchModule,
    CardModule,
    EditorModule,
    TabViewModule,
    FileUploadModule,
    ComponentsModule,
    ImageModule,
  ]
})
export class ProductsModule { }
