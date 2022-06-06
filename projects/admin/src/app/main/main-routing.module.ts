import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ReceiptsComponent } from './receipts/receipts.component';

const routes: Routes = [
  {path : '', component: MainComponent, children: [
    {path: 'categories', loadChildren :() => import('./categories/categories.module').then(m => m.CategoriesModule)},
    {path: 'orders', loadChildren :() => import('./invoices/invoices.module').then(m => m.InvoicesModule)},
    {path: 'providers', loadChildren :() => import('./providers/providers.module').then(m => m.ProvidersModule)},
    {path: 'product-details', loadChildren :() => import('./product-details/product-details.module').then(m => m.ProductDetailsModule)},
    {path: 'products', loadChildren :() => import('./products/products.module').then(m => m.ProductsModule)},
    {path: 'images', loadChildren :() => import('./images/images.module').then(m => m.ImagesModule)},
    {path: 'settings', loadChildren :() => import('./web-settings/web-settings.module').then(m => m.WebSettingsModule)},
    {path: 'customers', loadChildren :() => import('./customers/customers.module').then(m => m.CustomersModule)},
    {path: 'blogs', loadChildren :() => import('./blogs/blogs.module').then(m => m.BlogsModule)},
    {path: 'receipts', component: ReceiptsComponent},
    {path: '', loadChildren :() => import('./dashboard/dashboard.module').then(m => m.DashboardModule)},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
