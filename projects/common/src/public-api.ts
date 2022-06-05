import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const REST_API_SERVER = 'REST_API_SERVER';
export function forbiddenValue(value: any): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = control.value == value;
    return forbidden ? { forbiddenValue: { value: control.value } } : null;
  };
}
