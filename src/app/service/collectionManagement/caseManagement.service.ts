import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";
import {ObjToQueryString} from '../ObjToQueryString';

@Injectable({
  providedIn: "root"
})
export class CaseManagementService {
  constructor(private http: HttpClient) {}
  setOverdueOrderKeep(data: Object) {
    let url = GLOBAL.API.collectionManagement.caseManagement.setOverdueOrderKeep;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  getData(data: Object) {
    let url = GLOBAL.API.collectionManagement.caseManagement.queryOverdueOrder;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  allocate(data: Object) {
    let url = GLOBAL.API.collectionManagement.caseManagement.allocate;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  loanUser(data){
    let url = GLOBAL.API.collectionManagement.caseManagement.loanUser;
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
  exportOverdueOrder(data: Object) {
    let para = ObjToQueryString(data);
    let url = GLOBAL.API.collectionManagement.caseManagement.exportOverdueOrder+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
    return;
  }
  //获取消息提醒列表
  getRemindList(usrId : Number){

    let url = GLOBAL.API.collectWorkBench.remindRecord + "/" + usrId ;
    return this.http.get(url);

  };
  //获取公司ID
  getFirmID(){
    let url = GLOBAL.API.collectWorkBench.getCurrentEmployeeFirmID ;
    return this.http.get(url);
  };
  //获取员工ID
  getStaffID(){
    let url = GLOBAL.API.collectWorkBench.getCurrentEmployeeStaffID ;
    return this.http.get(url);
  };
  //更新消息提醒列表
  updateRemind(data: Object){

    let url = GLOBAL.API.collectWorkBench.updateRemind ;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });

  };
}
