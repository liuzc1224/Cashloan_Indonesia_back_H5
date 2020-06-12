import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RepaymentService {
  constructor(private http: HttpClient) {}

  getRepayment(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.repayment.getRepayment;
    return this.http.get(url, {
      params: para
    });
  }
  getRepaymentInfo(data: Object) {
    let url = GLOBAL.API.msgCenter.repayment.getRepaymentInfo;
    return this.http.get(url + "/" + data["id"]);
  }
}
