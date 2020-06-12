import { Pipe, PipeTransform } from "@angular/core";
import { orderStatustransform } from "../format";
import { SessionStorageService } from "../service/storage";

@Pipe({
  name: "StatusPipe"
})
export class StatusPipe implements PipeTransform {
  constructor(private sgo: SessionStorageService) {}

  transform(value: any): any {
    return orderStatustransform(value);
  }
}
