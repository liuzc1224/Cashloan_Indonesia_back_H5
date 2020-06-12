import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { incSoufromtransform } from "../format";
@Pipe({
  name: "IncSouPipe"
})
export class IncSouPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return incSoufromtransform(value);
  }
}
