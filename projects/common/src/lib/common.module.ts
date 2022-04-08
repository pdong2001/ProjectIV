import { NgModule } from '@angular/core';
import { CommonComponent } from './common.component';
import { Page404Component } from './page404/page404.component';
import { Page403Component } from './page403/page403.component';



@NgModule({
  declarations: [
    CommonComponent,
    Page404Component,
    Page403Component
  ],
  imports: [
  ],
  exports: [
    CommonComponent
  ]
})
export class CommonModule { }
