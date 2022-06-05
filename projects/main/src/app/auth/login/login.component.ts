import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';
import { CartService } from 'projects/common/src/lib/services/cart.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;
  public logInFailed: boolean = false;
  return_url: string | undefined;
  constructor(
    private oauthService: AuthService,
    private authDataService: AuthDataService,
    private router: Router,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
    this.form.setValue({
      email: 'admin@admin.test',
      password : 'password'
    });
    this.route.queryParams.subscribe({
      next: (params) => {
        this.return_url = params['return_url'];
      },
    });
  }

  ngOnInit(): void {}

  public login(e:any) {
    e.preventDefault();
    if (this.form.valid) {
      this.oauthService
        .login({
          email: this.form.value.email,
          password: this.form.value.password,
        })
        .subscribe({
          next: (res) => {
            if (res.status == true) {
              this.authDataService.token = res.meta.token;
              this.router.navigate([this.return_url ?? '/']);
            } else {
              this.logInFailed = true;
            }
          },
        });
    }
  }
}
