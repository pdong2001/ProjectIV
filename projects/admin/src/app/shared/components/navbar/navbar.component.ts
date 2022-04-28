import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto } from '../../../../../../common/src/Contracts/User/user-dto';
import { AuthDataService } from '../../../../../../common/src/services/auth-data.service';
import { OAuthService } from '../../../services/oauth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user!:UserDto;

  constructor(private authService:OAuthService,
    private authDataService:AuthDataService,
    private router:Router) { }

  ngOnInit(): void {
    this.authService.getUser()
    .toPromise()
    .then(res => {
      if (res?.status && res.data)
      {
        this.user = res.data;
      }
      else
      {
        this.authDataService.token = null;
        this.router.navigate(['account', 'login']);
      }
    });
  }

  logout(e:Event)
  {
    e.preventDefault();
    this.authService.logout().toPromise()
    .then(res => {
      if (res?.status == true)
      {
        this.authDataService.token = null;
        this.router.navigate(['account', 'login']);
      }
    })
  }

}
