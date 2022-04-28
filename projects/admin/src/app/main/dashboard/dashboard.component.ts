import { Component, OnInit } from '@angular/core';
import { TitleService } from 'projects/admin/src/app/services/title.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private titleService: TitleService) {
    titleService.setPageTitle('Dashboard');
    titleService.setTitle('Admin - Dashboard');
  }

  ngOnInit(): void {
  }

}
