import { Pipe, PipeTransform } from "@angular/core";
import { edutransform } from "../format";
@Pipe({
  name: "EduPipe"
})
export class EduPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return edutransform(value);
  }
}
