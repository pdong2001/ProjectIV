import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from '../customers/customers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ImageModule } from 'primeng/image';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { InputMaskModule } from 'primeng/inputmask';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { environment } from 'projects/admin/src/environments/environment';
import { InvoicesModule } from '../invoices/invoices.module';


@NgModule({
  declarations: [
    CustomersComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    ImageModule,
    FileUploadModule,
    DialogModule,
    ToolbarModule,
    CommonPipeModule.forRoot(environment),
    InputMaskModule,
    InvoicesModule
  ]
})
export class CustomersModule { }
