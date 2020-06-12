import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
@Pipe({
  name: "dateFormat"
})
export class dateFormatPipe implements PipeTransform {
  transform(value: any, format: string = "d-m-y"): any {
    return dataFormat(value, format);
  }
}
