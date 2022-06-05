import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpSertCustomerDto } from 'projects/common/src/Contracts/Customer/up-sert-customer-dto';
import { UserDto } from 'projects/common/src/Contracts/User/user-dto';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';
import { CustomerService } from 'projects/common/src/lib/services/customer.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private authDataService: AuthDataService,
    private customerService: CustomerService,
    private router : Router
  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      birth: new FormControl('', []),
      phone_number: new FormControl('', [
        Validators.pattern('d'),
        Validators.minLength(9),
      ]),
    });
    this.loadCustomerData();
  }
  user!: UserDto;
  form: FormGroup;

  ngOnInit(): void {}

  public logout() {
    this.authService.logout().subscribe((res) => {
      if (res.status == true) {
        this.authDataService.removeToken();
        this.router.navigate(['account', 'login']);
      }
    });
  }

  loadCustomerData()
  {
    this.authService.getUser().subscribe((res) => {
      if (res.status == true && res.data) {
        this.user = res.data;
        this.form.patchValue(this.user.customer);
      }
    });
  }

  public saveCustomer(files: FileList | null) {
    const customer: UpSertCustomerDto = { ...this.form.value };
    this.customerService
      .updateOne(customer, files && files?.length > 0 ? files[0] : undefined)
      .then((sub) => {
        sub.subscribe({
          next: (res) => {
            if (res.status == true) {

            }
          },
        });
      });
  }
}
