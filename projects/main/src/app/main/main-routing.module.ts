import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MainComponent } from './main.component';

const routes: Routes = [
  {path : '' , component : MainComponent, children : [
    {path : 'home', component: HomeComponent},
    {path : 'category', loadChildren: () => import('./category/category.module').then(m => m.CategoryModule)},
    {path : 'account', loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)},
    {path: '', redirectTo: 'home', pathMatch:'full'},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
