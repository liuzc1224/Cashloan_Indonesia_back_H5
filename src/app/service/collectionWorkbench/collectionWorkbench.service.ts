import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ObjToQuery } from '../ObjToQuery' ;
import { GLOBAL } from "../../global/global_settion";

@Injectable({
  providedIn: "root"
})
export class collectionWorkbenchService {
  constructor(private http: HttpClient) {}

  getFriendInfo(usrId: number) {
    const url = GLOBAL.API.order.user.friendInfo + "/" + usrId;
    return this.http.get(url);
  }
  getAddressBook(usrId: number) {
    const url = GLOBAL.API.order.user.addressBook + "/" + usrId;
    return this.http.get(url);
  }

  //查询催收日志
  getRecallLogList(paras : Object, orderId: Number){

    let url = GLOBAL.API.collectWorkBench.getRecallLog + "/" + orderId ;
    const para = ObjToQuery(paras);
    return this.http.get(url, {
      params: para
    });

  };
  //新增催收日志
  postRecallLog(paras : Object){
    let url = GLOBAL.API.collectWorkBench.addRecallLog ;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, paras, {
      headers: header
    });
  };

  //获取展期订单信息
  getExhibition(orderId: Number){

    let url = GLOBAL.API.collectWorkBench.getExhibition + "/" + orderId ;
    return this.http.get(url);
  };

  //新增展期
  exhibition(paras : Object){
    let url = GLOBAL.API.collectWorkBench.exhibition ;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.put(url, paras, {
      headers: header
    });
  };

  //查询催收通话记录
  getWebCallList(paras : Object, orderId: Number){

    let url = GLOBAL.API.collectWorkBench.getWebCallList + "/" + orderId ;
    const para = ObjToQuery(paras);
    return this.http.get(url, {
      params: para
    });
  };

  //查询催收短信记录
  getMsgLogList(paras : Object, orderId: Number){

    let url = GLOBAL.API.collectWorkBench.queryMsgLog + "/" + orderId ;
    const para = ObjToQuery(paras);
    return this.http.get(url, {
      params: para
    });
  };

  //查询案件流转记录
  getFlowHistoryt(paras : Object, orderId: Number){

    let url = GLOBAL.API.collectWorkBench.queryFlowHistory + "/" + orderId ;
    const para = ObjToQuery(paras);
    return this.http.get(url, {
      params: para
    });
  };

  //发送短信
  sendMsg(paras : Object){
    let url = GLOBAL.API.collectWorkBench.sendMsg ;
    let header = new HttpHeaders().set("Content-type", "application/json");
    return this.http.post(url, paras, {
      headers: header
    });
  };

  //获取借款订单详情
  getDetailList(usrId : number){

    let url = GLOBAL.API.collectWorkBench.recallDetail + "/" + usrId ;
    return this.http.get(url);

  };

  //获取工作台统计数据
  getAdminReport(usrId : Number){
    let url;
    if(usrId){
      url = GLOBAL.API.collectWorkBench.adminReport + "/" + usrId ;
    }else{
      url = GLOBAL.API.collectWorkBench.adminReport + "/"+ 0;
    }
    return this.http.get(url);

  };

  //获取工作台催收订单列表
  getOverdueOrder(paras : Object){

    let url = GLOBAL.API.collectWorkBench.overdueOrder ;
    const para = ObjToQuery(paras);
    return this.http.get(url, {
      params: para
    });

  };

  //导出工作台催收订单列表
  exportOverdueOrder(paras : Object){
    const para = ObjToQuery(paras);
    let url = GLOBAL.API.collectWorkBench.exportOverdueOrder+"?"+para ;
    window.location.href = url;
    return;

  };


}
