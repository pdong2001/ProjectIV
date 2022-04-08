import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmService } from './services/confirm.service';
import { TitleService } from './services/title.service';
import { ToastService } from './services/toast.service';

declare var Quill: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor() {
    var FontAttributor = Quill.import('attributors/class/font');
    FontAttributor.whitelist = [
      'sofia',
      'slabo',
      'roboto',
      'inconsolata',
      'ubuntu',
    ];
    Quill.register(FontAttributor, true);
  }
}
