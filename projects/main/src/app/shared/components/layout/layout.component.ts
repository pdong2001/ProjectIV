import { Component, OnInit } from '@angular/core';
import { WebInfoDto } from 'projects/common/src/Contracts/WebInfo/webinfo-dto';
import { WebInfoService } from 'projects/common/src/lib/services/web-info.service';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  public webSettings: WebInfoDto[] = [];

  constructor(private webinfoService: WebInfoService) { }

  ngOnInit(): void {
    this.loadSettings();
  }

  public loadSettings()
  {
    this.webinfoService.getList({})
    .subscribe({
      next: res => {
        if (res.status == true)
        {
          this.webSettings = res.data??[];
        }
      }
    })
  }
}
