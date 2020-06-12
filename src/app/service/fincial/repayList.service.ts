import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ObjToQueryString} from "../ObjToQueryString";

@Injectable({
  providedIn: "root"
})
export class RepayListService {
  constructor(private http: HttpClient) {}
  
  getList(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.finance.repayList;
    return this.http.get(url, {
      params: para
    });
  }

  makeRepay(data: Object) {
    let url = GLOBAL.API.finance.repay.repay;

    let header = new HttpHeaders().set("application", "application.json");

    return this.http.patch(url, data, {
      headers: header
    });
  }

  getTbale(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.finance.loanTable;
    return this.http.get(url, {
      params: para
    });
  }
  downloandLoanTable(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.finance.downloandLoanTable+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
  }
  exportData(data: Object){
    let para = ObjToQueryString(data);
    let url = GLOBAL.API.finance.downloandRepayData+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
    return;
  }

}
