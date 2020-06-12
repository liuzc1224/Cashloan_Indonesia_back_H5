import { FormControl } from "@angular/forms";

export const NumberValidator = {
  isNumber(control: FormControl) {
    let val = control.value;

    let reg = /^[0-9]*$/g;

    return reg.test(val) ? null : { invalid: true };
  }
};
