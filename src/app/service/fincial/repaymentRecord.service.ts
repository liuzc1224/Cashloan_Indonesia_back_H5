import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ObjToQueryString} from "../ObjToQueryString";

@Injectable({
  providedIn: "root"
})
export class repaymentRecordService {
  constructor(private http: HttpClient) {}
  
  getList(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.repaymentList;
    return this.http.get(url, {
      params: para
    });
  }

  downloandRepaymentList(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.finance.downloandRepaymentList+"?"+para;
    url = url.slice(0,-1);
    window.location.href = url;
  };


  // makeRepay(data: Object) {
  //   let url = GLOBAL.API.finance.repay.repay;

  //   let header = new HttpHeaders().set("application", "application.json");

  //   return this.http.patch(url, data, {
  //     headers: header
  //   });
  // }

  // getTbale(paras: Object) {
  //   // console.log(paras)
  //   let para = ObjToQuery(paras);

  //   let url = GLOBAL.API.finance.loanTable;
  //   return this.http.get(url, {
  //     params: para
  //   });
  // }

}
