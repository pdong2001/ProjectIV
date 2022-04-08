import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDataService } from '../../services/auth-data.service';
import { OAuthService } from '../../services/oauth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFailed :boolean = false;

  constructor(private authService:OAuthService,
    private authDataService:AuthDataService,
    private router:Router) { }

  ngOnInit(): void {
  }

  login(form:NgForm)
  {
    const email = form.value.email;
    const password = form.value.password;
    this.authService.login({
      email: email,
      password: password
    }).toPromise()
    .then(res => {
      if (res?.status)
      {
        this.authDataService.token = res.meta.token;
        this.router.navigate(['/']);
      }
      else
      {
        this.loginFailed = true;
      }
    })
  }

}
