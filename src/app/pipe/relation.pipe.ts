import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { relationfromtransform } from "../format";
@Pipe({
  name: "RelationPipe"
})
export class RelationPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return relationfromtransform(value);
  }
}
