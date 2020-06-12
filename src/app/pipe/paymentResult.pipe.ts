import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { SessionStorageService } from "../service/storage";
@Pipe({
  name: "paymentResult"
})
export class paymentResult implements PipeTransform {
  constructor(private sgo: SessionStorageService) {}

  transform(value: any): any {
    let EduLangEnum = this.sgo.get("lang")["financeModule"]["list"][
      "reaymentResult"
    ];

    let val = EduLangEnum.find(item => {
      return item.value == value;
    });

    return (val && val.name) || "未知状态";
  }
}
