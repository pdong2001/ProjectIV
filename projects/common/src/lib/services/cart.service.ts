import { Injectable } from '@angular/core';
import { CartDto } from '../../Contracts/Cart/cart-dto';
import { ProductDetailDto } from '../../Contracts/ProductDetail/product-detail-dto';
import { AuthDataService } from './auth-data.service';
import { AuthService } from './auth.service';
import { ServiceResponse } from '../../Contracts/Common/response';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { CRUDService } from './crudservice';
import { UpSertCartDto } from '../../Contracts/Cart/up-set-cart-dto';
import { PagedAndSortedRequest } from '../../Contracts/Common/paged-and-sorted-request';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  public cartItems: CartDto[] = [];
  CART_STORAGE_KEY: string = 'carts';
  CART_IDENTITY_STORAGE_KEY: string = 'cart_identity';
  constructor(
    private httpClient: HttpService,
    private authDataService: AuthDataService
  ) {}
  
  public createOrEditRange()
  {
    
  }

  public createOrEdit(
    cart: UpSertCartDto
  ): CartDto | Observable<ServiceResponse<number>> | undefined {
    if (this.authDataService.isLoggedIn()) {
      const payload = {
        product_detail_id: cart.product_detail_id,
        quantity: cart.quantity,
      };
      const url = 'admin/carts';
      return this.httpClient.post<ServiceResponse<number>>(url, payload);
    } else {
      let cartDto: CartDto | undefined = this.cartItems.find(
        (c) => c.product_detail_id == cart.product_detail_id
      );
      if (cartDto) {
        cartDto.quantity += cart.quantity;
      } else {
        const id = JSON.parse(
          localStorage.getItem(this.CART_IDENTITY_STORAGE_KEY) ?? '1'
        ) as number;
        cartDto = {
          ...cart,
          id: id,
          created_at: new Date(),
        };
        this.cartItems.push(cartDto);
      }
      this.saveToLocal();
      return cartDto;
    }
  }

  public getList({
    request,
  }: {
    request: PagedAndSortedRequest;
  }): CartDto[] | Observable<ServiceResponse<CartDto[]>> {
    if (!this.authDataService.isLoggedIn()) {
      if (!this.cartItems) {
        this.cartItems = JSON.parse(
          localStorage.getItem(this.CART_STORAGE_KEY) ?? '[]'
        );
      }
      return this.cartItems;
    } else {
      const url = 'admin/carts';
      let params: HttpParams = new HttpParams();
      let value: keyof PagedAndSortedRequest;
      for (value in request) {
        if (request[value] != undefined) {
          params = params.append(value, request[value] as any);
        }
      }
      return this.httpClient.get<ServiceResponse<CartDto[]>>(url, {
        params: params,
      });
    }
  }

  public update(id: number, cart: UpSertCartDto) {
    if (!this.authDataService.isLoggedIn()) {
      const cartIndex = this.cartItems.findIndex((c) => c.id == id);
      if (cartIndex >= 0) {
        const cartDto = this.cartItems[cartIndex];
        cartDto.quantity = cart.quantity;
        cartDto.product_detail_id = cart.product_detail_id;
        this.saveToLocal();
      }
      return true;
    } else {
      const url = `admin/carts/${id}`;
      return this.httpClient.put<ServiceResponse<number>>(url, cart);
    }
  }

  public delete(id: number) {
    if (!this.authDataService.isLoggedIn()) {
      const cartIndex = this.cartItems.findIndex((c) => c.id == id);
      if (cartIndex >= 0) {
        this.cartItems.splice(cartIndex, 1);
        this.saveToLocal();
      }
      return id;
    } else {
      const url = `admin/carts/${id}`;
      return this.httpClient.delete<ServiceResponse<boolean>>(url);
    }
  }

  protected saveToLocal() {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cartItems));
  }
}
