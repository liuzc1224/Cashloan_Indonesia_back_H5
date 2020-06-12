import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class CouponService {
  constructor(private http: HttpClient) {}

  getList(obj: Object) {
    let url = GLOBAL.API.coupon.list;

    let para = ObjToQuery(obj);

    return this.http.get(url, {
      params: para
    });
  }
  delete(data: Object) {
    let url = GLOBAL.API.coupon.delete;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
  getCoupon(obj: Object) {
    let url = GLOBAL.API.coupon.getCoupon;

    let para = ObjToQuery(obj);

    return this.http.get(url, {
      params: para
    });
  }
  push(data: Object) {
    let url = GLOBAL.API.coupon.push;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url + "/" + data["id"], {
      headers: header
    });
  }
  pauseButton(data: Object) {
    let url = GLOBAL.API.coupon.pauseButton;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  update(data: Object) {
    let url = GLOBAL.API.coupon.update;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  addCoupon(data: Object) {
    let url = GLOBAL.API.coupon.addCoupon;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
}
