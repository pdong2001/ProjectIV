import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDto } from 'projects/common/src/Contracts/User/user-dto';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';
import { AuthService } from 'projects/common/src/lib/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private authDataService: AuthDataService,

  ) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      province: new FormControl('', [Validators.required]),
      district: new FormControl('', [Validators.required]),
      commune: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      birth : new FormControl('', []),
    });
    this.authService.getUser().subscribe((res) => {
      if (res.status == true && res.data) {
        this.user = res.data;
        this.form.patchValue(this.user.customer);
      }
    });
  }
  user!: UserDto;
  form: FormGroup;

  ngOnInit(): void {}

  public logout() {
    this.authService.logout().subscribe((res) => {
      if (res.status == true) {
        this.authDataService.removeToken();
      }
    });
  }


}
