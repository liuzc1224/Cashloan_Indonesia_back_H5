import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { payTtpefromtransform } from "../format";
@Pipe({
  name: "PayMoneyPipe"
})
export class PayMoneyPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return payTtpefromtransform(value);
  }
}
