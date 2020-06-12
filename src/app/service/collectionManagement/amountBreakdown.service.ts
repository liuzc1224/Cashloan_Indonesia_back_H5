import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";
import {ObjToQueryString} from '../ObjToQueryString';

@Injectable({
  providedIn: "root"
})
export class AmountBreakdownService {
  constructor(private http: HttpClient) {}
  //催回金额明细
  urgentRecallAmountDetail(data: Object) {
    let url = GLOBAL.API.collectionManagement.amountBreakdown.urgentRecallAmountDetail;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  //催回金额明细 导出
  exportDetail(data: Object) {
    let para = ObjToQueryString(data);
    let url = GLOBAL.API.collectionManagement.amountBreakdown.exportDetail+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
    return;
  }
}
