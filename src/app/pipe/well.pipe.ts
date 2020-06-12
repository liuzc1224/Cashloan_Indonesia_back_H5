import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { placefromtransform } from "../format";
@Pipe({
  name: "wellPipe"
})
export class WellPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return placefromtransform(value);
  }
}
