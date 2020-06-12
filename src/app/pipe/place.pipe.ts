import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { placetransform } from "../format";
@Pipe({
  name: "PlacePipe"
})
export class PlacePipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return placetransform(value);
  }
}
