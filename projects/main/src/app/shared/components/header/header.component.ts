import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthDataService } from 'projects/common/src/lib/services/auth-data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public isLoggedIn: boolean;
  constructor(private authDataService: AuthDataService, router: Router) {
    this.isLoggedIn = authDataService.isLoggedIn();
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = authDataService.isLoggedIn();
      }
    });
  }

  ngOnInit(): void {}
}
