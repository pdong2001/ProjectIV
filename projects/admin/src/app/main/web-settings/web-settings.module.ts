import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSettingsRoutingModule } from './web-settings-routing.module';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { WebSettingsComponent } from './web-settings.component';
import { ToolbarModule } from 'primeng/toolbar';
import { ComponentsModule } from '../../shared/components/components.module';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { FileUploadModule } from 'primeng/fileupload';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { TabViewModule } from 'primeng/tabview';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { environment } from 'projects/admin/src/environments/environment';


@NgModule({
  declarations: [
    WebSettingsComponent
  ],
  imports: [
    CommonModule,
    WebSettingsRoutingModule,
    TableModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    RippleModule,
    ToolbarModule,
    ReactiveFormsModule,
    ComponentsModule,
    EditorModule,
    ImageModule,
    DialogModule,
    DropdownModule,
    TooltipModule,
    FileUploadModule,
    TabViewModule,
    CommonPipeModule.forRoot(environment)
  ],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class WebSettingsModule { }
