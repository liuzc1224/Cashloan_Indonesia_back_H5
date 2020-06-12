import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from "../ObjToQuery";
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class ChannelBranchService {
  constructor(private http: HttpClient) {}
  update(data: Object) {
    let url = GLOBAL.API.channel.channelBranch.update;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, data, {
      headers: header
    });
  }
  getChannelBranch(obj: Object) {
    let url = GLOBAL.API.channel.channelBranch.getChannelBranch;
    let para = ObjToQuery(obj);
    return this.http.get(url, {
      params: para
    });
  }
  invitationCode(data: Object) {
    let url = GLOBAL.API.channel.channelBranch.invitationCode;
    return this.http.get(url + "/" + data);
  }
  addChannelBranch(data: Object) {
    let url = GLOBAL.API.channel.channelBranch.addChannelBranch;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, data, {
      headers: header
    });
  }
  unUsedQuantity(data: Object) {
    let url = GLOBAL.API.channel.channelBranch.unUsedQuantity;
    return this.http.get(url + "/" + data);
  }
  exChannelBranch(data: Object) {
    let url = GLOBAL.API.channel.channelBranch.export + "/" + data["channelId"];
    window.location.href = url;
    return;
    // return this.http.get(url , {
    //   params : para
    // });
  }
  imChannelBranch(data) {
    let url = GLOBAL.API.channel.channelBranch.import;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url + "/" + data.get("channelId"), data, {
      headers: header
    });
  }
  generate(data: Object) {
    let url =
      GLOBAL.API.channel.channelBranch.generate +
      "/" +
      data["channelId"] +
      "?channelId=" +
      data["channelId"] +
      "&count=" +
      data["count"];
    // let para = ObjToQuery(data) ;
    window.location.href = url;
    // return this.http.get(url+"/"+data['channelId'],{
    //   params : para
    // });
  }
}
