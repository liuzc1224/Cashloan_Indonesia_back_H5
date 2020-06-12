import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RecordService {
  constructor(private http: HttpClient) {}

  getBasicInfo(usrId: number) {
    const url = GLOBAL.API.order.loanRecord.detail + "/" + usrId;

    return this.http.get(url);
  }

  getOrderListInfo(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.order.loanRecord.orderQuery;
    return this.http.get(url, {
      params: para
    });
  }

  getLetterListInfo(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.order.loanRecord.letterQuery;
    return this.http.get(url, {
      params: para
    });
  }
}
