import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { CartDto } from 'projects/common/src/Contracts/Cart/cart-dto';
import { UserDto } from 'projects/common/src/Contracts/User/user-dto';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';
import { CartService } from 'projects/common/src/lib/services/cart.service';
import { InvoiceDetailService } from 'projects/common/src/lib/services/invoice-detail.service';
import { InvoiceService } from 'projects/common/src/lib/services/invoice.service';
import { ProductDetailService } from 'projects/common/src/lib/services/product-detail.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  cartItems: CartDto[] = [];
  subTotals: number = 0;
  user: UserDto | undefined;
  constructor(
    private authDataService: AuthDataService,
    private cartService: CartService,
    private authService: AuthService,
    private productDetailService: ProductDetailService,
    private invoiceService: InvoiceService,
    private invoiceDetailService: InvoiceDetailService,
    private confirmationService: ConfirmationService,
    private toastService: ToastService,
    private router : Router
  ) {
    this.form = new FormGroup({
      customer_name: new FormControl('', [Validators.required]),
      phone_number: new FormControl('', [
        Validators.required,
        Validators.minLength(9),
        Validators.pattern(
          '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
        ),
      ]),
      address: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
      note: new FormControl('', []),
    });
    if (this.authDataService.isLoggedIn()) {
      this.authService.getUser().subscribe((res) => {
        if (res.status == true) {
          this.user = res.data;
          this.form.patchValue({
            ...res.data?.customer,
            customer_name: res.data?.customer.name,
            note: ''
          });
        }
      });
    }
  }

  ngOnInit(): void {
    this.loadCartData();
  }

  calculateSubTotals() {
    this.subTotals = 0;
    this.cartItems.forEach((item) => {
      this.subTotals += item.quantity * (item.product_detail?.out_price ?? 0);
    });
  }

  loadCartData() {
    this.cartService
      .getList({
        page: 1,
        with_detail: true,
        limit: 9999,
        column: 'created_at',
        sort: 'DESC',
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.cartItems = res.data ?? [];
          let sentRequest = 0;
          this.cartItems.forEach((c) => {
            if (!c.product_detail) {
              sentRequest++;
              this.productDetailService.get(c.product_detail_id).subscribe({
                next: (res) => {
                  if (res.status == true) {
                    c.product_detail = res.data;
                  }
                },
                complete: () => {
                  sentRequest--;
                  if (sentRequest == 0) {
                    this.calculateSubTotals();
                  }
                },
              });
            }
          });
          this.calculateSubTotals();
        }
      });
  }

  public placeOrder() {
    if (this.form.valid && this.cartItems.length > 0) {
      const toHome = () => {
        this.router.navigate(['/']);
      }
      this.invoiceService.create({
        paid: 0,
        customer_id: this.user?.customer?.id,
        ...this.form.value,
      }).subscribe({
        next: res => {
          if (res.status == true && res.data)
          {
            this.cartItems.forEach(i => {
              this.invoiceDetailService.create({
                product_detail_id: i.product_detail_id,
                quantity: i.quantity,
                invoice_id: res.data??0
              }).subscribe();
            })
            this.cartService.checkout().subscribe();
            this.confirmationService.confirm({
              rejectVisible : false,
              closeOnEscape: true,
              accept: toHome,
              reject: toHome,
              message: "Đặt hàng thành công. Mã đơn hàng của bạn là "+ res.data
            });
          }
        }
      });
    }
  }
}
