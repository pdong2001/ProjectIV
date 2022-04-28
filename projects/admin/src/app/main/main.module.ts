import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ComponentsModule } from '../shared/components/components.module';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';



@NgModule({
  declarations: [
    MainComponent,  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ComponentsModule,
    ToastModule,
    ConfirmDialogModule
  ],
})
export class MainModule { }
