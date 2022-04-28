import { Component, OnInit } from "@angular/core";
import { TitleService } from "projects/admin/src/app/services/title.service";

declare var layoutScripts:any;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {
  private _pageTitle!: string;
  public get pageTitle(): string {
    return this._pageTitle;
  }
  public set pageTitle(value: string) {
    this._pageTitle = value;
  }

  constructor(private breadCrumpService: TitleService) {
    this.breadCrumpService.pageTile$.subscribe(
      (title) => (this.pageTitle = title)
    );
  }

  ngOnInit(): void {
    layoutScripts();
  }
}
