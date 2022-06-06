import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogsRoutingModule } from './blogs-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { environment } from 'projects/admin/src/environments/environment';
import { CommonPipeModule } from 'projects/common/src/lib/common-pipe/common-pipe.module';
import { BlogsComponent } from './blogs.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [BlogsComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    InputNumberModule,
    ImageModule,
    FileUploadModule,
    DialogModule,
    ToolbarModule,
    CommonPipeModule.forRoot(environment),
    InputMaskModule,
    EditorModule,
  ],
})
export class BlogsModule {}
