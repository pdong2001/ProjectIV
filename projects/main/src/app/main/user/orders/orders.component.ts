import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from 'projects/common/src/Contracts/User/user-dto';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit {
  user: UserDto | undefined;
  constructor(
    private authService: AuthService,
    private authDataService: AuthDataService,
    private router: Router
  ) {
    this.authService.getUser().subscribe({
      next: (res) => {
        if (res.status == true) {
          this.user = res.data;
        }
      },
    });
  }

  ngOnInit(): void {}

  public logout() {
    this.authService.logout().subscribe((res) => {
      if (res.status == true) {
        this.authDataService.removeToken();
        this.router.navigate(['account', 'login']);
      }
    });
  }
}
