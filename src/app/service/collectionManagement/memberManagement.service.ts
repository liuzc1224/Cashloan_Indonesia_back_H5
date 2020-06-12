import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class MemberManagementService {
  constructor(private http: HttpClient) {}
//公司
  queryOverdueFirm(obj: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.queryOverdueFirm;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  updateOverdueFirm(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.updateOverdueFirm;
    let header = new HttpHeaders().set("Content-type", "application/json");
    console.log(data);
    return this.http.post(url, data, {
      headers: header
    });
  }
  addOverdueFirm(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.addOverdueFirm;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
//小组
  addOverdueGroup(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.addOverdueGroup;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  queryOverdueGroup(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.queryOverdueGroup;
    let para = ObjToQuery(data);
    return this.http.get(url, {
      params: para
    });
  }
  updateOverdueGroup(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.updateOverdueGroup;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
//人员
  queryOverdueStaff(obj: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.queryOverdueStaff;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  updateOverdueStaff(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.updateOverdueStaff;
    let header = new HttpHeaders().set("Content-type", "application/json");
    console.log(data);
    return this.http.post(url, data, {
      headers: header
    });
  }
  addOverdueStaff(data: Object) {
    let url = GLOBAL.API.collectionManagement.memberManagement.addOverdueStaff;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  getAllOverdueFirm() {
    let url = GLOBAL.API.collectionManagement.memberManagement.getAllOverdueFirm;
    return this.http.get(url);
  }
  getAllOverdueGroup() {
    let url = GLOBAL.API.collectionManagement.memberManagement.getAllOverdueGroup;
    return this.http.get(url);
  }
}
