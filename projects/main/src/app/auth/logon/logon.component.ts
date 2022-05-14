import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';
import { ToastService } from 'projects/common/src/lib/services/toast.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css'],
})
export class LogonComponent implements OnInit {
  form: FormGroup;
  emailExists: boolean = false;
  constructor(
    private authService: AuthService,
    private authDataService: AuthDataService,
    private router: Router,
    private toastService : ToastService
  ) {
    this.form = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        passwordConfirm: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        accept : new FormControl('', [Validators.requiredTrue])
      }
    );
  }
  ngOnInit(): void {}

  register() {
    if (this.form.valid && this.form.value.password == this.form.value.passwordConfirm)
    {
      this.authService.register({
        name : this.form.value.name,
        email: this.form.value.email,
        password : this.form.value.password
      }).subscribe(res => {
        if (res.message?.includes('email'))
        {
          this.emailExists = true;
        }
        if (res.status == true)
        {
          this.toastService.addSuccess('Đăng ký tài khoản thành công');
          this.router.navigate(['/account/login']);
        }
      });
    }
  }
}
