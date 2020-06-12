import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class repaymentCodeService {
  constructor(private http: HttpClient) {}

  getList(data: Object) {
    const url = GLOBAL.API.order.repaymentCode.getRepaymentCode;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }
  needAddRepaymentCode(orderId: string) {
    const url = GLOBAL.API.order.repaymentCode.needAddRepaymentCode;

    return this.http.get(url+"/"+orderId);
  }

  addRepaymentCode(data: Object) {
    const url = GLOBAL.API.order.repaymentCode.addRepaymentCode;

    const header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  getLink(id: string){
    let url = GLOBAL.API.order.repaymentCode.getLink;
    return this.http.get(url+"/"+id);
  }

  // imChannelBranch(data) {
  //   let url = GLOBAL.API.channel.channelBranch.import;
  //   let header = new HttpHeaders().set("Content-type", "application/json");
  //   return this.http.post(url + "/" + data.get("channelId"), data, {
  //     headers: header
  //   });
  // }

  // getRiskRecord(data: Object) {
  //   const url = GLOBAL.API.order.record.risk;

  //   const para = ObjToQuery(data);

  //   return this.http.get(url, {
  //     params: para
  //   });
  // }

  // productList(userGrade: string) {
  //   const url = GLOBAL.API.order.list.product;
  //   let obj = ObjToQuery({ userGrade: userGrade });
  //   return this.http.get(url+"/"+userGrade);
  // }

}
