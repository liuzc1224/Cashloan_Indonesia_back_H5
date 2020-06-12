import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class SplashScreenService {
  constructor(private http: HttpClient) {}

  getSplashScreen() {
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.getSplashScreen;
    return this.http.get(url);
  }
  addSplashScreen(data: FormData) {
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.addSplashScreen;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  updateSplashScreen(data: FormData) {
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.updateSplashScreen+"/"+data.get('id');
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }

  deleteSplashScreen(data: Object) {
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.deleteSplashScreen;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  getPushWay(){
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.getPushWay;
    return this.http.get(url);
  }
  setPushWay(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.setPushWay;
    let para = ObjToQuery(data);
    return this.http.put(url, data, {
      params: para
    });
  }
  moveUp(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.moveUp;
    return this.http.patch(url+"/"+data['id'],data);
  }
  moveDown(data: Object){
    let url = GLOBAL.API.appMarketing.adPush.splashScreen.moveDown;
    return this.http.patch(url+"/"+data['id'],data);
  }
}
