import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ReportService {
  constructor(private http: HttpClient) {}
  exportGroupStatement(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportGroupStatement+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
  exportStatement(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportStatement+"?"+para;
    url = url.substring(0,url.length-1);
    window.location.href = url;
    return;
  }
  getGroupStatement(obj: Object) {
    let url = GLOBAL.API.collectionManagement.report.getGroupStatement;
    let para = ObjToQuery(obj);
    console.log(para);
    return this.http.get(url, {
      params: para
    });
  }
  getStatement(data: Object) {
    let url = GLOBAL.API.collectionManagement.report.getStatement;
    let para = ObjToQuery(data);
    console.log(para);
    return this.http.get(url, {
      params: para
    });
    // let url = GLOBAL.API.collectionManagement.report.getStatement+"?";
    // console.log(data);
    // let para = ObjToQueryString(data);
    // url+=para;
    // url = url.substring(0,url.length-1);
    // return this.http.get(url);
  }
  loanUser(data){
    let url = GLOBAL.API.collectionManagement.report.loanUser;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  getAllOverdueGroup(data) {
    let url = GLOBAL.API.collectionManagement.memberManagement.getAllOverdueGroup;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  getAllOverdueStaff(data){
    let url = GLOBAL.API.collectionManagement.caseManagement.getAllOverdueStaff;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  //催收阶段报表
  getOverdueReceivableStageStatement(data){
    let url = GLOBAL.API.collectionManagement.report.overdueReceivableStageStatement;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  exportOverdueReceivableStageStatement(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportOverdueReceivableStageStatement+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
  //催收小组报表 - 累计
  getUrgentRecallGroupStatementTotal(data){
    let url = GLOBAL.API.collectionManagement.report.total;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  exportUrgentRecallGroupStatementTotal(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportTotal+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
  //催收小组报表 - 明细
  getUrgentRecallGroupStatementDetail(data){
    let url = GLOBAL.API.collectionManagement.report.detail;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  exportUrgentRecallGroupStatementDetail(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.collectionManagement.report.exportDetail+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
}
