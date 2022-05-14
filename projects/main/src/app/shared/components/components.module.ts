import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductBoxComponent } from './product-box/product-box.component';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { environment } from 'projects/admin/src/environments/environment';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProductInfoComponent } from './product-info/product-info.component';
import { GalleriaModule } from 'primeng/galleria'
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    PageNotFoundComponent,
    ProductBoxComponent,
    ProductInfoComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    CommonPipeModule.forRoot(environment),
    ButtonModule,
    RippleModule,
    GalleriaModule,
    InputNumberModule,
    FormsModule
  ],
  exports : [
    LayoutComponent,
    ProductBoxComponent,
    ProductInfoComponent
  ]
})
export class ComponentsModule { }
