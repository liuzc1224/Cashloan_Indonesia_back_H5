import { Injectable } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class RecommendService {
  constructor(private http: HttpClient) {}

  getRecommend(paras: Object) {
    let para = ObjToQuery(paras);
    let url = GLOBAL.API.appMarketing.recommend.getRecommend;
    return this.http.get(url, {
      params: para
    });
  }
  addRecommend(data: FormData) {
    let url = GLOBAL.API.appMarketing.recommend.addRecommend;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url, data, {
      headers: header
    });
  }
  updateRecommend(data: FormData) {
    let url = GLOBAL.API.appMarketing.recommend.updateRecommend;
    let header = new HttpHeaders().set("Content-type", "application/json");

    return this.http.post(url+ "/" + data.get('id'), data, {
      headers: header
    });
  }

  deleteRecommend(data: Object) {
    let url = GLOBAL.API.appMarketing.recommend.deleteRecommend;

    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.delete(url + "/" + data["id"]);
  }
}
