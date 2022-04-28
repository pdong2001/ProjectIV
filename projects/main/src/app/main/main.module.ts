import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ComponentsModule } from '../shared/components/components.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    MainComponent,
    HomeComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ComponentsModule,
    RouterModule
  ]
})
export class MainModule { }
