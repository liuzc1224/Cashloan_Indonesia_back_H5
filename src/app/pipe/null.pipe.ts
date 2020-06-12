import { Pipe, PipeTransform } from "@angular/core";
import { nulltransform } from "../format";
@Pipe({
  name: "nullPipe"
})
export class nullPipe implements PipeTransform {
  transform(value: any): any {
    return nulltransform(value);
  }
}
