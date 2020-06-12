import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ChannelH5Service {
  constructor(private http: HttpClient) {}
  getChannelH5(obj: Object) {
    let url = GLOBAL.API.channel.channelH5.getChannelH5;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  update(data: Object) {
    let url = GLOBAL.API.channel.channelH5.update;
    let header = new HttpHeaders().set("Content-type", "application/json");
    console.log(data);
    return this.http.put(url+"/"+data['id'], data, {
      headers: header
    });
  }
  addChannelH5(data: Object) {
    let url = GLOBAL.API.channel.channelH5.addChannelH5;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  allPackage(){
    let url = GLOBAL.API.channel.channelH5.package;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.get(url, {
      headers: header
    });
  }
}
