import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class CollectionBusiness {
  constructor(private http: HttpClient) {}
  update(data: Object) {
    let url = GLOBAL.API.collectionBusiness.updateData;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  getData(obj: Object) {
    let url = GLOBAL.API.collectionBusiness.getData;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  addData(data: Object) {
    let url = GLOBAL.API.collectionBusiness.addData;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
}
