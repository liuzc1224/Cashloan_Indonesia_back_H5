import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {ObjToQueryString} from "../ObjToQueryString";

@Injectable({
  providedIn: "root"
})
export class LoanListService {
  constructor(private http: HttpClient) {}

  loanList(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.loanList;
    return this.http.get(url, {
      params: para
    });
  }

  repayList(paras: Object) {
    let para = ObjToQuery(paras);

    let url = GLOBAL.API.finance.repayList;
    return this.http.get(url, {
      params: para
    });
  }

  postLoan(data: Object) {
    let url = GLOBAL.API.finance.loanList;

    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  makeLoan(data: Object) {
    let url = GLOBAL.API.finance.loan.loan;

    let header = new HttpHeaders().set("Contype-type", "application/json");

    return this.http.patch(url, data, {
      headers: header
    });
  }
  exportLoanData(data: Object){
    let para = ObjToQueryString(data);
    let url = GLOBAL.API.finance.exportLoanData+"?"+para;
    url = url.slice(0,-1);
    window.location.href = url;
    return;
  }
  //放款审核
  paymentReview(data: Object){
    let url = GLOBAL.API.finance.paymentReview;
    let header = new HttpHeaders().set("Contype-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
}
