import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class abnormalLendingService {
  constructor(private http: HttpClient) {}
  
  getAbnormalLending(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.finance.getAbnormalLending;
    return this.http.get(url, {
      params: para
    });
  }
  // downloandLoanTable(obj: Object){
  //   let url = GLOBAL.API.finance.downloandLoanTable;
  //   location.href=url+"?"
  //   +(obj["orderNo"]==null||obj["orderNo"]==""?"":"orderNo=")+(obj["orderNo"]==null?"":obj["orderNo"])+"&"
  //   +(obj["serialNumber"]==null||obj["serialNumber"]==""?"":"serialNumber=")+(obj["serialNumber"]==null?"":obj["serialNumber"])+"&"
  //   +(obj["account"]==null||obj["account"]==""?"":"account=")+(obj["account"]==null?"":obj["account"])+"&"
  //   +(obj["userName"]==null||obj["userName"]==""?"":"userName=")+(obj["userName"]==null?"":obj["userName"])+"&"
  //   +(obj["card"]==null||obj["card"]==""?"":"card=")+(obj["card"]==null?"":obj["card"])+"&"
  //   +(obj["startTime"]==null||obj["startTime"]==""?"":"startTime=")+(obj["startTime"]==null?"":obj["startTime"])+"&"
  //   +(obj["endTime"]==null||obj["endTime"]==""?"":"endTime=")+(obj["endTime"]==null?"":obj["endTime"])+"&"
  //   +(obj["payMinDate"]==null||obj["payMinDate"]==""?"":"payMinDate=")+(obj["payMinDate"]==null?"":obj["payMinDate"])+"&"
  //   +(obj["payMaxDate"]==null||obj["payMaxDate"]==""?"":"payMaxDate=")+(obj["payMaxDate"]==null?"":obj["payMaxDate"]);
  // }

}
