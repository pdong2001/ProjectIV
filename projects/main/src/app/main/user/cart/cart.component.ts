import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
} from '@angular/core';
import { CartDto } from 'projects/common/src/Contracts/Cart/cart-dto';
import { CartService } from 'projects/common/src/lib/services/cart.service';
import { ProductDetailService } from 'projects/common/src/lib/services/product-detail.service';
declare var layoutInit: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit, AfterViewInit {
  cartItems: CartDto[] = [];
  init = true;
  loadedCartItems = false;
  subTotals = 0;
  constructor(
    private cartService: CartService,
    private productDetailService: ProductDetailService
  ) {}
  ngAfterViewInit(): void {
    console.log('checked');
    if (this.init && this.loadedCartItems) {
      layoutInit();
      this.init = false;
    }
  }

  ngOnInit(): void {
    this.loadCartData();
  }

  deleteCart(id: number) {
    this.cartService.delete(id).subscribe((res) => {
      if (res.status == true) {
        this.cartItems.splice(
          this.cartItems.findIndex((c) => c.id == id),
          1
        );
        this.calculateSubTotals();
      }
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
        this.loadedCartItems = true;
      });
  }

  calculateSubTotals() {
    this.subTotals = 0;
    this.cartItems.forEach((item) => {
      this.subTotals += item.quantity * (item.product_detail?.out_price ?? 0);
    });
  }

  updateCart(cart: CartDto) {
    this.cartService
      .update(cart.id, {
        product_detail_id: cart.product_detail_id,
        quantity: cart.quantity,
      })
      .subscribe((res) => {
        if (res.status == true) {
          this.calculateSubTotals();
        }
      });
  }
}
