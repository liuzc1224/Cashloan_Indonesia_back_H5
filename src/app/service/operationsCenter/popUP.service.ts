import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PopUPService {
  constructor(private http: HttpClient) {}

  getPopUP() {
    let url = GLOBAL.API.appMarketing.adPush.popUps.getPopUps;
    return this.http.get(url);
  }
  addPopUP(data: FormData) {
    let url = GLOBAL.API.appMarketing.adPush.popUps.addPopUps;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  updatePopUP(data: FormData) {
    let url = GLOBAL.API.appMarketing.adPush.popUps.updatePopUps+"/"+data.get('id');
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  deletePopUP(data: Object) {
    let url = GLOBAL.API.appMarketing.adPush.popUps.deletePopUps;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  getPushWay(){
    let url = GLOBAL.API.appMarketing.adPush.popUps.getPushWay;
    return this.http.get(url);
  }
  setPushWay(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.popUps.setPushWay;
    let para = ObjToQuery(data);
    return this.http.put(url, data, {
      params: para
    });
  }
  moveUp(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.popUps.moveUp;
    return this.http.patch(url+"/"+data['id'],data);
  }
  moveDown(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.popUps.moveDown;
    return this.http.patch(url+"/"+data['id'],data);
  }
}
