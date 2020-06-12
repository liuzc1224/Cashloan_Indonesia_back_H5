import { Pipe, PipeTransform } from "@angular/core";
import { reviewOrderStatustransform } from "../format";
@Pipe({
  name: "reviewOrder"
})
export class reviewOrderPipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return reviewOrderStatustransform(value);
  }
}
