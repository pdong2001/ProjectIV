import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailsRoutingModule } from './product-details-routing.module';
import { ProductDetailsComponent } from './product-details.component';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { ComponentsModule } from '../../shared/components/components.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductDetailsRoutingModule,
    TableModule,
    TabViewModule,
    ButtonModule,
    InputTextModule,
    ToolbarModule,
    DialogModule,
    DropdownModule,
    FormsModule,
    ImageModule,
    FileUploadModule,
    ComponentsModule,
    InputSwitchModule,
    ReactiveFormsModule,
    InputNumberModule,
  ]
})
export class ProductDetailsModule { }
