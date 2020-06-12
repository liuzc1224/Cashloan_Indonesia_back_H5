import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { SessionStorageService } from "../service/storage";
@Pipe({
  name: "seconds"
})
export class SecondsPipe implements PipeTransform {
  constructor(private sgo: SessionStorageService) {}

  transform(value: any): any {
    let val = Math.ceil(value / 1000);

    return val || "no";
  }
}
