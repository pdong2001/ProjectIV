import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { InfoType } from 'projects/common/src/Contracts/WebInfo/info-type.enum';
import { WebInfoDto } from 'projects/common/src/Contracts/WebInfo/webinfo-dto';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  @Input() set settings(value:WebInfoDto[]) {
    this.webSettings[InfoType.ContactIcon] = value.filter(v => v.name == InfoType.ContactIcon.toString());
    this.webSettings[InfoType.Slide] = value.filter(v => v.name == InfoType.Slide.toString());
    this.webSettings[InfoType.Footer] = value.filter(v => v.name == InfoType.Footer.toString());
    this.webSettings[InfoType.Header] = value.filter(v => v.name == InfoType.Header.toString());
  };
  public InfoTypes = InfoType;
  webSettings : { [index:string] : WebInfoDto[] } = {};
  constructor(public sanitizer: DomSanitizer) {   }

  ngOnInit(): void {
  }

}

