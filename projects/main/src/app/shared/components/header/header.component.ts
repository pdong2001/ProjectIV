import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserDto } from 'projects/common/src/Contracts/User/user-dto';
import { InfoType } from 'projects/common/src/Contracts/WebInfo/info-type.enum';
import { WebInfoDto } from 'projects/common/src/Contracts/WebInfo/webinfo-dto';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';
import { CartService } from 'projects/common/src/lib/services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input('settings') settings: WebInfoDto[] = [];
  private _isLoggedIn!: boolean;
  public get isLoggedIn(): boolean {
    return this._isLoggedIn;
  }
  cartCount : number = 0;
  public set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    if (this.isLoggedIn) {
      this.authService.getUser().subscribe({
        next: (res) => {
          if (res.status && res.data) {
            this.user = res.data;
          }
        },
      });
    }
  }
  public user!: UserDto;
  constructor(
    private authDataService: AuthDataService,
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.isLoggedIn = authDataService.isLoggedIn();
    this.authDataService.$token.subscribe((token) => {
      this.isLoggedIn = token != null;
    });
    this.cartService.$cartCount.subscribe(count => {
      this.cartCount = count;
    });
    this.cartService.getList({page: 1, limit: 9999}).subscribe();
  }

  public getSettings(name : string)
  {
    return this.settings.filter(s => s.name == name);
  }

  public getOne(name :string)
  {
    return this.settings.find(s => s.name == name);
  }

  public infoType = InfoType;

  ngOnInit(): void {}
}
