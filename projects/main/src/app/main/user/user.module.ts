import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { environment } from 'projects/main/src/environments/environment';


@NgModule({
  declarations: [
    ProfileComponent,
    CartComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonPipeModule.forRoot(environment),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
  ]
})
export class UserModule { }
