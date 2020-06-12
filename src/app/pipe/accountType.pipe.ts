import { Pipe, PipeTransform } from "@angular/core";
import { accountTypetransform } from "../format";
@Pipe({
  name: "accountTypePipe"
})
export class accountTypePipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return accountTypetransform(value);
  }
}
