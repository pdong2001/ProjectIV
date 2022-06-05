import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoicesRoutingModule } from './invoices-routing.module';
import { InvoicesComponent } from '../invoices/invoices.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';


@NgModule({
  declarations: [
    InvoicesComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ToastModule,
    TableModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    DialogModule,
    ToolbarModule,
    DropdownModule,
    InputSwitchModule,
    RippleModule,
    InvoicesRoutingModule,
    ReactiveFormsModule,
    InputNumberModule
  ],
  exports : [InvoicesComponent]
})
export class InvoicesModule { }
