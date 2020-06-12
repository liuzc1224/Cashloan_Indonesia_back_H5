import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class repaymentNoticeService {
  constructor(private http: HttpClient) {}
  
  getList(paras: Object) {
    // console.log(paras)
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.repaymentNoticeList;
    return this.http.get(url, {
      params: para
    });
  }

  getThis(id: any){
      let url = GLOBAL.API.finance.getThisRepaymentNotice;
      return this.http.get(url + "/" + id);
    }

  updateRepaymentNotice(paras : Object){
    let url = GLOBAL.API.finance.updateRepaymentNotice;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, paras, {
      headers: header
    });
  };

  getUserHeaderImg(userId: any) {
    let url = GLOBAL.API.finance.getUserHeaderImg;
    return this.http.get(url + "/" + userId);
  }

  // downloadAccountMonitoring(obj: Object){
  //   let url = GLOBAL.API.finance.downloadAccountMonitoring;

  //   location.href=url+"?"
  //   +(obj["platformName"]===null||obj["platformName"]===""?"":"platformName=")+(obj["platformName"]===null?"":obj["platformName"])+"&";
  // };


  // update(paras : Object){
  //   let url = GLOBAL.API.finance.updateAccountMonitoringList ;
  //   let header = new HttpHeaders().set("Content-type", "application/json");
  //   return this.http.put(url, paras, {
  //     headers: header
  //   });
  // };

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
