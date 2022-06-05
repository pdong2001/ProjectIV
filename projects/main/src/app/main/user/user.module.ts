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
import { ImageModule } from 'primeng/image';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './orders/orders.component';
import { InvoicesModule } from 'projects/admin/src/app/main/invoices/invoices.module';


@NgModule({
  declarations: [
    ProfileComponent,
    CartComponent,
    CheckoutComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    CommonPipeModule.forRoot(environment),
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    ImageModule,
    InvoicesModule
  ]
})
export class UserModule { }
