import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  constructor(private http: HttpClient) {}

  riskOper(data: Object) {
    const url = GLOBAL.API.order.operate.risk.audit;

    const header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  duration(userId: number) {
    const url = GLOBAL.API.order.operate.risk.duration + "/" + userId;

    return this.http.get(url);
  }

  getRiskRecord(data: Object) {
    const url = GLOBAL.API.order.record.risk;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }

  getPaymentRecord(data: Object) {
    const url = GLOBAL.API.order.record.payment;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }

  getLoanRecord(data: Object) {
    const url = GLOBAL.API.order.record.loan;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }

  // plan
  getRepaymentRecord(data: Object) {
    const url = GLOBAL.API.order.record.repayment;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }

  //record
  getRepaymentRecords(data: Object) {
    const url = GLOBAL.API.order.record.repaymentRecord;

    const para = ObjToQuery(data);

    return this.http.get(url, {
      params: para
    });
  }

  rebackOrder(data: Object) {
    const url = GLOBAL.API.order.operate.reback;

    const header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  orderDetail(orderId: number | string) {
    const url = GLOBAL.API.order.list.detail + "/" + orderId;

    return this.http.get(url);
  }
  applyCash(userId: number | string) {
    const url = GLOBAL.API.order.user.bankInfo + "/" + userId;

    return this.http.get(url);
  }
  bankcardByOrderId(orderId: number | string) {
    const url = GLOBAL.API.order.user.bankcardByOrderId + "/" + orderId;

    return this.http.get(url);
  }

  repayment(orderId: number | string) {
    const url = GLOBAL.API.order.list.repayment + "/" + orderId;

    return this.http.get(url);
  }
  loan(orderId: number | string) {
    const url = GLOBAL.API.order.record.loanList + "/" + orderId;

    return this.http.get(url);
  }
  getStream(orderId: number | string) {
    const url = GLOBAL.API.order.list.getStream + "/" + orderId;

    return this.http.get(url);
  }

  productList(userGrade: string) {
    const url = GLOBAL.API.order.list.product;
    let obj = ObjToQuery({ userGrade: userGrade });
    return this.http.get(url+"/"+userGrade);
  }
  //审核拒绝理由
  queryAuditRejectDesc(){
    const url = GLOBAL.API.order.list.queryAuditRejectDesc;
    return this.http.get(url);
  }
  //审核
  riskAudit(data: Object) {
    const url = GLOBAL.API.order.user.riskAudit;

    const header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.put(url, data, {
      headers: header
    });
  }

  //黑名单状态
  creditStatus(data: Object) {
    const url = GLOBAL.API.order.user.creditStatus;

    const header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.put(url, data, {
      headers: header
    });
  }
}
