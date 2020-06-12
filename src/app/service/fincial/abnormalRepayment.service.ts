import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ObjToQueryString} from "../ObjToQueryString";

@Injectable({
  providedIn: "root"
})
export class abnormalRepaymentService {
  constructor(private http: HttpClient) {}
  
  getAbnormalRepayment(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.finance.getAbnormalRepayment;
    return this.http.get(url, {
      params: para
    });
  }

  downabnormalRepaymentList(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.finance.downAbnormalRepayment+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
  };
}
