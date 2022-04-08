import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesComponent } from './categories.component';
import { CategoriesRoutingModule } from './categories-routing.module';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import {InputSwitchModule} from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    FormsModule,
    CommonModule,
    CategoriesRoutingModule,
    ToastModule,
    TableModule,
    ButtonModule,
    ProgressBarModule,
    InputTextModule,
    DialogModule,
    ToolbarModule,
    DropdownModule,
    InputSwitchModule,
    RippleModule
  ],
  exports: [CategoriesComponent],
})
export class CategoriesModule {}
