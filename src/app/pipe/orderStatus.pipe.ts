import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { orderStatustransform } from "../format";
import { SessionStorageService } from "../service/storage";

@Pipe({
  name: "OrderStatusPipe"
})
export class OrderStatusPipe implements PipeTransform {
  constructor(private sgo: SessionStorageService) {}

  transform(value: any): any {
    return orderStatustransform(value);
  }
}
