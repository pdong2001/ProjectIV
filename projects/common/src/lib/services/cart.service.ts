import { Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { CartDto } from '../../Contracts/Cart/cart-dto';
import { ProductDetailDto } from '../../Contracts/ProductDetail/product-detail-dto';
import { AuthDataService } from './auth-data.service';
import { AuthService } from './auth.service';
import { ServiceResponse } from '../../Contracts/Common/response';
import { HttpService } from './http.service';
import { map, Observable, Subscriber } from 'rxjs';
import { CRUDService } from './crudservice';
import { UpSertCartDto } from '../../Contracts/Cart/up-set-cart-dto';
import { PagedAndSortedRequest } from '../../Contracts/Common/paged-and-sorted-request';
import { HttpParams } from '@angular/common/http';
import { CartLookUpDto } from '../../Contracts/Cart/cart-look-up-dto';
import { ProductDetailService } from './product-detail.service';

const CartLocalKey: string = 'cart';
const CartIdentityLocalKey: string = 'cartidentity';
@Injectable({
  providedIn: 'root',
})
export class CartService extends CRUDService<
  CartDto,
  UpSertCartDto,
  CartLookUpDto
> {
  protected override controller: string = 'admin/carts';
  public $cartCount: Observable<number>;
  protected $cartCountSub: Subscriber<number> | undefined;
  constructor(
    httpClient: HttpService,
    private authDataService: AuthDataService,
    private productDetailService: ProductDetailService
  ) {
    super(httpClient);
    this.$cartCount = new Observable<number>(
      (sub) => (this.$cartCountSub = sub)
    );
    this.authDataService.$token.subscribe({
      next: (token) => {
        this.refreshCount();
      },
    });
  }
  private _cart: CartDto[] = [];
  public get cart(): CartDto[] {
    return this._cart;
  }
  public set cart(value: CartDto[]) {
    this._cart = value;
    this.saveToLocal();
  }
  protected loadFormLocal() {
    this.cart = JSON.parse(localStorage.getItem(CartLocalKey) ?? '[]');
  }
  protected addToLocal(input: UpSertCartDto) {
    if (this.cart.length == 0) this.loadFormLocal();

    let item = this.cart.find(
      (i) => i.product_detail_id == input.product_detail_id
    );
    if (item) item.quantity += input.quantity;
    else {
      const id = JSON.parse(localStorage.getItem(CartIdentityLocalKey) ?? '1');
      localStorage.setItem(CartLocalKey, JSON.stringify(id + 1));
      item = {
        product_detail_id: input.product_detail_id,
        quantity: input.quantity,
        created_at: new Date(),
        id: id,
      };
    }
    this.cart.push(item);
    this.$cartCountSub?.next(this.cart.length);
    this.saveToLocal();
    return item;
  }
  protected saveToLocal() {
    localStorage.setItem(CartLocalKey, JSON.stringify(this.cart));
  }
  protected updateLocal(id: number, input: UpSertCartDto) {
    if (this.cart.length == 0) this.loadFormLocal();
  }

  protected deleteLocal(id: number): ServiceResponse<number> {
    const itemIndex = this.cart.findIndex((i) => i.id == id);
    if (itemIndex >= 0) {
      this.cart.splice(itemIndex, 1);
      this.saveToLocal();
      return {
        status: true,
        data: id,
      };
    } else {
      return {
        status: false,
      };
    }
  }

  public override create(
    input: UpSertCartDto
  ): Observable<ServiceResponse<number>> {
    let response;
    if (this.authDataService.isLoggedIn())
      response = super.create(input).pipe(
        map((res) => {
          if (res.status == true) {
            this.refreshCount();
          }
          return res;
        })
      );
    response = new Observable<ServiceResponse<number>>((sub) => {
      const item = this.addToLocal(input);
      sub.next({ status: true, data: item.id });
    });
    return response;
  }

  public override update(
    id: any,
    input: UpSertCartDto
  ): Observable<ServiceResponse<number>> {
    if (this.authDataService.isLoggedIn())
      return super.update(id, input).pipe(
        map((res) => {
          if (res.status == true) {
            this.refreshCount();
          }
          return res;
        })
      );
    return new Observable<ServiceResponse<number>>((sub) => {
      const item = this.addToLocal(input);
      sub.next({ status: true, data: item.id });
    });
  }

  public refreshCount() {
    if (this.authDataService.isLoggedIn()) {
      this.getList({ page: 1, limit: 0 });
    } else {
      this.loadFormLocal();
    }
  }

  public override getList(
    request: CartLookUpDto
  ): Observable<ServiceResponse<CartDto[]>> {
    if (this.authDataService.isLoggedIn())
      return super.getList(request).pipe(
        map((res) => {
          if (res.status == true) {
            this.$cartCountSub?.next(res.meta.total ?? 0);
          }
          return res;
        })
      );
    return new Observable<ServiceResponse<CartDto[]>>((sub) => {
      const limit = request.limit ?? 99999;
      const page = request.page ?? 1;
      this.loadFormLocal();
      const data = this.cart.slice((page - 1) * limit, page * limit);
      let sent = 0;
      data.forEach((i) => {
        if (!i.product_detail) {
          sent++;
          this.productDetailService.get(i.product_detail_id).subscribe({
            next: (res) => {
              if (res.status == true) {
                i.product_detail = res.data;
              }
              sent--;
              if (sent == 0) {
                sub.next({
                  status: true,
                  data: data,
                  meta: { total: this.cart.length },
                });
              }
            },
          });
        }
      });
    });
  }

  public override delete(id: any): Observable<ServiceResponse<number>> {
    if (this.authDataService.isLoggedIn()) {
      return super.delete(id);
    } else {
      return new Observable<ServiceResponse<number>>((sub) => {
        sub.next(this.deleteLocal(id));
      });
    }
  }

  public checkout() {
    const url = this.controller + '/checkout';
    this.clearCache();
    localStorage.removeItem(CartLocalKey);
    localStorage.removeItem(CartIdentityLocalKey);
    return this.httpClient.post<ServiceResponse<any>>(url).pipe(
      map((res) => {
        if (res.status == true) {
          this.refreshCount();
        }
      })
    );
  }

  public clearCache() {
    this.cart = [];
  }
}
