import { Injectable, EventEmitter, OnInit } from "@angular/core";
import { GLOBAL } from "../../global/global_settion";
import { ObjToQuery } from "../ObjToQuery";
import { ObjToQueryString } from "../ObjToQueryString";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}
  //查询本登录人员的信审员工
  getCurrentStaffId(){
    const url = GLOBAL.API.order.user.getCurrentStaffId;

    return this.http.get(url);
  }
  // 登录信息
  getLoginInfo(usrId: number){
    const url = GLOBAL.API.order.user.loginInfo + "/" + usrId;

    return this.http.get(url);
  }
  //借款订单信息
  getOrderInfo(data: object){
    const url = GLOBAL.API.order.user.orderInfo + "/" + data['creditOrderId'];

    return this.http.get(url);
  }
  //用户信息 (已绑定用户信息 + 个人信息-用户录入)
  getUserInfo(data: object){
    const url = GLOBAL.API.order.user.userInfo + "/" + data['orderId'];

    return this.http.get(url);
  }
  //用户工作信息
  getUserWorkInfo(data: object){
    const url = GLOBAL.API.order.user.userWorkInfo + "/" + data['orderId'];

    return this.http.get(url);
  }
  //当前设备信息
  getDeviceInfo(data: object){
    const url = GLOBAL.API.order.user.deviceInfo + "/" + data['creditOrderId'];

    return this.http.get(url);
  }
  //联系人-用户录入
  getUserContact(data: object){
    const url = GLOBAL.API.order.user.userContact + "/" + data['orderId'];

    return this.http.get(url);
  }
  //KTP验证
  getKtpCheckInfo(data: object){
    const url = GLOBAL.API.order.user.ktpCheckInfo;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //活体校验
  getLivingCheckInfo(data: object){
    const url = GLOBAL.API.order.user.livingCheckInfo;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //风险识别-星合星探
  riskIdentification(data: object) {
    const url = GLOBAL.API.order.user.xingheReport + "/" + data['creditOrderId'];
    return this.http.get(url);
  }
  //多设备号
  getCreditDeviceInfo(data: object) {
    const url = GLOBAL.API.order.user.creditDeviceInfo + "/" + data['userId'];
    return this.http.get(url);
  }
  // 评分查询-advance.ai
  getAdvanceInfo(data: object){
    const url = GLOBAL.API.order.user.advanceInfo + "/" + data['userId'];
    return this.http.get(url);
  }



  //用户基本信息
  // getBasicInfo(usrId: number) {
  //   const url = GLOBAL.API.order.user.basicInfo + "/" + usrId;
  //
  //   return this.http.get(url);
  // }
  //设备信息
  // getDeviceInfo(usrId: number) {
  //   const url = GLOBAL.API.order.user.deviceInfo + "/" + usrId;
  //
  //   return this.http.get(url);
  // }
  // 信用分
  getCreditScore(data: object) {
    const url = GLOBAL.API.order.user.creditScore + "/" + data['userId'];

    return this.http.get(url);
  }
  // 电信分
  getTelecomScore(data: object) {
    const url = GLOBAL.API.order.user.telecomScore + "/" + data['userId'];
    return this.http.get(url);
  }
  //个人信息
  getPersonalInfo(usrId: number) {
    const url = GLOBAL.API.order.user.personalInfo + "/" + usrId;

    return this.http.get(url);
  }
  //历史借款订单
  getListHistoryBorrowOrder(data: object) {
    const url = GLOBAL.API.order.user.listHistoryBorrowOrder;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //人脸黑名单-星合星探
  getFaceBlacklistData(data: object) {
    const url = GLOBAL.API.order.user.faceBlacklistData;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  //拨号检测数据展示
  getListMsisdn(data: object) {
    const url = GLOBAL.API.order.user.listMsisdn + "/" + + data['creditOrderId'];

    return this.http.get(url);
  }
  //拨号检测
  queryMsisdnStatus(data: object) {
    const url = GLOBAL.API.order.user.queryMsisdnStatus ;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }
  // 手输入 拨号检测数据展示
  getListMsisdnManualRecord(data: object) {
    const url = GLOBAL.API.order.user.listMsisdnManualRecord ;
    let para = ObjToQuery(data) ;
    return this.http.get(url , {
      params : para
    });
  }


  // 历史申请订单
  getApplyOrder(data: object) {
    const para = ObjToQuery(data);
    const url = GLOBAL.API.order.user.applyOrder;
    return this.http.get(url, {
      params: para
    });
  }
  //历史借还信息
  getBorrowInfo(usrId: number) {
    const url = GLOBAL.API.order.user.borrowInfo + "/" + usrId;
    return this.http.get(url);
  }

  //查询当前用户的运营商信息
  getTelecomType(usrId: number) {
    const url = GLOBAL.API.order.user.getTelecomType + "/" + usrId;
    return this.http.get(url);
  }
  //查询telkomsel运营商信息
  getTelkomselData(usrId: number) {
    const url = GLOBAL.API.order.user.getTelkomselData + "/" + usrId;
    return this.http.get(url);
  }
  //查询XL运营商信息
  getXLData(usrId: number) {
    const url = GLOBAL.API.order.user.getXLData + "/" + usrId;
    return this.http.get(url);
  }
  getIndosatData(usrId: number) {
    const url = GLOBAL.API.order.user.getIndosatData + "/" + usrId;
    return this.http.get(url);
  }
  //自研模型调用
  getUserGradeBySelfSupport(data: object) {
    const url = GLOBAL.API.order.user.getUserGradeBySelfSupport + "/" + data['creditOrderId'] + "/" + data['type'];
    return this.http.get(url);
  }
  getAccountInfo(userId: number) {
    const url = GLOBAL.API.order.user.accountInfo + "/" + userId;

    return this.http.get(url);
  }


  getOrderDetailInfo(usrId: number, data: object) {
    const para = ObjToQuery(data);

    const url = GLOBAL.API.order.user.orderDetailInfo + "/" + usrId;

    return this.http.get(url, {
      params: para
    });
  }

  getBankInfo(userId: number) {
    const url = GLOBAL.API.order.user.bankInfo + "/" + userId;
    return this.http.get(url);
  }
  //联系人状态编辑
  updateUserContactStatusput(data: object) {
    const url = GLOBAL.API.order.user.updateUserContactStatusput;
    const header = new HttpHeaders()
      .set("Content-type" , "application/json") ;
    return this.http.put(url , data , {
      headers : header
    })
  }
  //用户账户；公司电话状态编辑
  updateUserPhoneStatus(data: object) {
    const url = GLOBAL.API.order.user.updateUserPhoneStatus;
    const header = new HttpHeaders()
      .set("Content-type" , "application/json") ;
    return this.http.put(url , data , {
      headers : header
    })
  }

  //发送短信
  sendMsg(data: object) {
    const url = GLOBAL.API.order.user.sendMsg;
    const header = new HttpHeaders()
      .set("Content-type" , "application/json") ;
    return this.http.post(url , data , {
      headers : header
    })
  }
}
