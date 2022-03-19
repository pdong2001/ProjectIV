import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';



@NgModule({
  declarations: [
    LayoutComponent,
    SidebarComponent,
    FooterComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ComponentsModule { }
