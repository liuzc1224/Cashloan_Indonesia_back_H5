import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ChannelService {
  constructor(private http: HttpClient) {}
  getList(obj: Object) {
    let url = GLOBAL.API.channel.getList;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  update(data: Object) {
    let url = GLOBAL.API.channel.update;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  addChannel(data: Object) {
    let url = GLOBAL.API.channel.addChannel;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  getChannelList(obj: Object) {
    // console.log(obj)
    let url = GLOBAL.API.channel.getChannelList;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  downloadChannelList(obj: Object) {
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.channel.downloadChannelList+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
  }
  getH5List(obj: Object) {
    // console.log(obj)
    let url = GLOBAL.API.channel.getH5List;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  getPageNameList() {
    let url = GLOBAL.API.channel.getPageNameList;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.get(url, {
      headers: header
    });
  }
  downloadH5PageNameList(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.channel.downloadH5PageNameList+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
  }
  getAFList(obj: Object) {
    // console.log(obj)
    let url = GLOBAL.API.channel.getAFList;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  downloadAFList(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.channel.downloadAFList+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
  }
  getAFDailyList(obj: Object) {
    // console.log(obj)
    let url = GLOBAL.API.channel.getAFDailyList;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  downloadAFDailyList(obj: Object){
    let para = ObjToQueryString(obj);
    let url = GLOBAL.API.channel.downloadAFDailyList+"?"+para;
    url = url.substring(0,url.length-1);
    console.log(url);
    window.location.href = url;
  }
}
