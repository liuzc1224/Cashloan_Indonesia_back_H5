import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
//PUSH推送
export class MsgPushService {
  constructor(private http: HttpClient) {}

  getMsgPush(paras: Object) {
    // console.log(paras);
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.msgPush.getMsgPush;
    return this.http.get(url, {
      params: para
    });
  }
  addMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.addMsgPush;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  updateMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.updateMsgPush;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  deleteMsgPush(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.deleteMsgPush;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.get(url + "/" + data["id"]);
  }

  //公告
  getNotice(paras: Object) {
    // console.log(paras);
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.msgCenter.msgPush.getNotice;
    return this.http.get(url, {
      params: para
    });
  }
  addNotice(data: Object) {
    // console.log(data)
    let url = GLOBAL.API.msgCenter.msgPush.addNotice;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  updateNotice(data: Object) {
    console.log(data)
    let url = GLOBAL.API.msgCenter.msgPush.updateNotice;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  deleteNotice(data: Object) {
    let url = GLOBAL.API.msgCenter.msgPush.deleteNotice;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.get(url + "/" + data["id"]);
  }
}
