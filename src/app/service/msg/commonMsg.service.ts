import { Injectable, OnInit } from "@angular/core";
import { MsgService } from "./msg.service";
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: "root"
})
export class CommonMsgService implements OnInit {
  constructor(private msg: MsgService, private translateSer: TranslateService) {
    this.getLang();
  }

  ngOnInit() {
    this.getLang();
  }
  fetchFail(reason: string) {
    const prefix = this.languagePack["tips"]["fetchFailReason"];

    this.msg.error(prefix + reason);
  }

  operateSuccess() {
    const prefix = this.languagePack["tips"]["operateSuccess"];

    this.msg.success(prefix);
  }
  operateTrue(reason: string) {
    const prefix = this.languagePack["tips"]["operateSuccess"];

    this.msg.success(prefix +","+ reason);
  }
  operateFail(reason: string) {
    const prefix = this.languagePack["tips"]["operateFailWithReason"];

    this.msg.error(prefix + reason);
  }
  private languagePack: object;
  private getLang() {
    this.translateSer.stream("common").subscribe(res => {
      this.languagePack = res;
    });
  }
}
