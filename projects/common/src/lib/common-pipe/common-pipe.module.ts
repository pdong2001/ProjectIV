import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilePathPipe } from './file-path.pipe';
import { SanitizerPipe } from './sanitizer.pipe';
import { Environment } from '../../Contracts/Common/environment';

@NgModule({
  declarations: [FilePathPipe, SanitizerPipe],
  imports: [CommonModule],
  exports: [FilePathPipe, SanitizerPipe],
})
export class CommonPipeModule {
  public static forRoot(environment: Environment): ModuleWithProviders<CommonPipeModule> {
    return {
      ngModule: CommonPipeModule,
      providers: [
        {
          provide: 'env', // you can also use InjectionToken
          useValue: environment,
        },
      ],
    };
  }
}
