import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren :() => import('./main/main.module').then(m => m.MainModule)},
  {path: 'account', loadChildren :() => import('./authenticate/authenticate.module').then(m => m.AuthenticateModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
