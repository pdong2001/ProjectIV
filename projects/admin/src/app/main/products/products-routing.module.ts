import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../auth.guard';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductsComponent } from './products.component';

const routes: Routes = [
  {path: ':id' , component: ProductDetailComponent, canActivate: [AuthGuard]},
  {path: '' , component: ProductsComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
