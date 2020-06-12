import { Pipe, PipeTransform } from "@angular/core";
import { marraytransform } from "../format";
@Pipe({
  name: "MarryPipe"
})
export class MarryPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return marraytransform(value);
  }
}
