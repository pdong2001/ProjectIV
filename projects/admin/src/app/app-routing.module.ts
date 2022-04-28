import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

const routes: Routes = [
  {path: '', loadChildren :() => import('./main/main.module').then(m => m.MainModule)},
  {path: 'account', loadChildren :() => import('./authenticate/authenticate.module').then(m => m.AuthenticateModule)},
  {path: '**',component:PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
