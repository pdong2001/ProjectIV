import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { ComponentsModule } from '../shared/components/components.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { environment } from '../../environments/environment';
import { FormsModule } from '@angular/forms';
import { BlogsComponent } from './blogs/blogs.component';
import { BlogComponent } from './blog/blog.component';


@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    BlogsComponent,
    BlogComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    ComponentsModule,
    RouterModule,
    FormsModule,
    CommonPipeModule.forRoot(environment)
  ]
})
export class MainModule { }
