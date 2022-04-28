import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FileTableComponent } from './file-table/file-table.component';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductOptionTableComponent } from './product-option-table/product-option-table.component';



@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    FileTableComponent,
    PageNotFoundComponent,
    ProductOptionTableComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    RippleModule
  ],
  exports: [
    LayoutComponent,
    FileTableComponent,
    ProductOptionTableComponent
  ]
})
export class ComponentsModule { }
