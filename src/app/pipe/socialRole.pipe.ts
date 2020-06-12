import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { socialRolefromtransform } from "../format";
@Pipe({
  name: "SocialRolePipe"
})
export class SocialRolePipe implements PipeTransform {
  constructor() {}

  transform(value: any): any {
    return socialRolefromtransform(value);
  }
}
