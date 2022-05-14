import { Inject, Pipe, PipeTransform } from '@angular/core';
import { environment } from 'projects/admin/src/environments/environment';
import { Environment } from '../../Contracts/Common/environment';

@Pipe({
  name: 'filePath'
})
export class FilePathPipe implements PipeTransform {

  constructor(@Inject('env') private environment :Environment)
  {

  }
  transform(value: string | undefined, ...args: unknown[]): string {
    if (value)
      return this.environment.FILE_GET_BY_NAME + value;
    return "";
  }

}
