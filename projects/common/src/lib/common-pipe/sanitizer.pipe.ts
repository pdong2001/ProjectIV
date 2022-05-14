import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizer'
})
export class SanitizerPipe implements PipeTransform {

  constructor(private sannitizer : DomSanitizer){}

  transform(value: string | undefined, ...args: unknown[]) {
    if (value) return this.sannitizer.bypassSecurityTrustHtml(value);
    return "";
  }

}
