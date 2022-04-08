import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  {path : '', component: MainComponent, children: [
    {path: '', loadChildren :() => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
    {path: 'categories', loadChildren :() => import('./categories/categories.module').then(m => m.CategoriesModule)},
    {path: 'products', loadChildren :() => import('./products/products.module').then(m => m.ProductsModule)},
    {path: 'images', loadChildren :() => import('./images/images.module').then(m => m.ImagesModule)},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
