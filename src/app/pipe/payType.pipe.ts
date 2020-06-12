import { Pipe, PipeTransform } from "@angular/core";
import { dataFormat } from "../format/dateFormat";
import { SessionStorageService } from "../service/storage";
@Pipe({
  name: "PayTypePipe"
})
export class PayTypePipe implements PipeTransform {
  constructor(private sgo: SessionStorageService) {}

  transform(value: any): any {
    let EduLangEnum = this.sgo.get("lang")["financeModule"]["list"][
      "repayType"
    ];

    let val = EduLangEnum.find(item => {
      return item.value == value;
    });

    return (val && val.name) || "未知状态";
  }
}
