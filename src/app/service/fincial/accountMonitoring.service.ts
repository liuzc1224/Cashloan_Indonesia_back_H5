import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ObjToQueryString} from "../ObjToQueryString";

@Injectable({
  providedIn: "root"
})
export class accountMonitoringService {
  constructor(private http: HttpClient) {}
  
  getList(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.accountMonitoringList;
    return this.http.get(url, {
      params: para
    });
  }

  downloadAccountMonitoring(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.finance.downloadAccountMonitoring+"?"+para;
    url = url.slice(0,-1);
    window.location.href = url;
  };


  update(paras : Object){
    let url = GLOBAL.API.finance.updateAccountMonitoringList ;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, paras, {
      headers: header
    });
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
