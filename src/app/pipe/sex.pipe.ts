import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { sextransform } from "../format";
@Pipe({
  name: "SexPipe"
})
export class SexPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    console.log("sex", value);
    return sextransform(value);
  }
}
