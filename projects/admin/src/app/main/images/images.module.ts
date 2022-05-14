import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImagesRoutingModule } from './images-routing.module';
import { ImagesComponent } from './images.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DataViewModule } from 'primeng/dataview';
import { ToolbarModule } from 'primeng/toolbar';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageCropperModule } from 'ngx-image-cropper';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from 'projects/admin/src/environments/environment';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';


@NgModule({
  declarations: [
    ImagesComponent
  ],
  imports: [
    CommonModule,
    ImagesRoutingModule,
    DataViewModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    ToolbarModule,
    ImageModule,
    FormsModule,
    DialogModule,
    FileUploadModule,
    ImageCropperModule,
    TooltipModule,
    CommonPipeModule.forRoot(environment)
  ]
})
export class ImagesModule { }
