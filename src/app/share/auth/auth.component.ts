import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UserService } from "../../service/order";
import { filter } from "rxjs/operators";
import {CommonMsgService, MsgService} from '../../service/msg';
import { Response } from "../model";
import { TableData } from "../../share/table/table.model";
import { unixTime, reviewOrderStatustransform ,DateObjToString} from "../../format";
import {style} from '@angular/animations';
import {UserLevelService} from "../../service/productCenter";
import {Router} from "@angular/router";
import {ObjToQueryString} from "../../service/ObjToQueryString";
import {FormBuilder, FormGroup} from "@angular/forms";
import {collectionWorkbenchService} from "../../service/collectionWorkbench";
declare var STI: any;
declare var $: any;
@Component({
  selector: "auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class AuthComponent {
  constructor(
    private translate: TranslateService,
    private usrSer: UserService,
    private Cmsg: CommonMsgService,
    private router : Router,
    private msg: MsgService,
    private UserLevelService: UserLevelService,
    private fb: FormBuilder,
    private collectionWorkbenchService: collectionWorkbenchService
  ) {}

  userId: number;
  orderId: number;
  phoneDetection:string;
  languagePack: Object;
  status:number=1;
  statusEnum :Array<Object>;
  userLevelData :Array<Object>;
  tableData :Array<Object>;
  loading:boolean=false;
  orderInfoData:object;// 借款订单信息
  userInfoData:object;//用户信息 (已绑定用户信息 + 个人信息-用户录入)
  deviceInfoData:object;//当前设备信息
  userWorkInfoData:object;//工作信息-用户录入
  userContactData:Array<object>;//联系人-用户录入
  phoneData:object;//通讯录
  ktpCheckInfoData:object;//KTP验证
  livingCheckInfoData:object;//活体校验
  riskIdentificationData:object;//风险识别-星合星探
  creditDeviceInfoData:object;//多设备号
  advanceData:any;//评分查询-advance.ai
  historyBorrowOrderData:object;//历史借款订单
  faceBlacklistData:object;//人脸黑名单-星合星探
  listMsisdnData:object;//拨号检测数据展示
  listMsisdnManualRecordData:object;//手输入 拨号检测数据展示
  gradeBySelfSupport:object;//自研模型调用
  faceBlacklistState: Boolean = false;
  friendInfo:Array<any>=[]; // 紧急联系人
  phoneList:Array<any>=[]; // 通讯录
  phoneListData:Array<any>=[]; // 通讯录
  phoneForm: FormGroup;
  creditScore:any=null;
  telecomScore:any=null;
  isOkLoading:Boolean=false;
  applyOrderData: TableData;
  borrowInfoData : TableData;
  indosatData;
  telkomselData;
  XLData;
  phoneModel:Boolean=false;
  phoneCall: string;
  phoneArray: Array<Object> = [{
    phone:""
  }]; // 输入框电话
  choosePhoneArray: Array<String> = []; // 已选择电话
  phoneType:Number = 1;
  phoneMdlType:number=1;
  allChecked:Boolean = false;
  indeterminate :Boolean = false;
  staffData:object ;

  getData(userId: number, orderId: number) {
    this.userId = userId;
    this.orderId = orderId;
    // this.order = order;
    this.getLanguage();
    this.initData();
  }
  getLanguage() {
    this.translate
      .stream([
        "financeModule.list",
        "common",
        "riskModule",
        "authModule",
        "orderList.allList",
        "reviewRiskList.tableModule",
      ])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["financeModule.list"],
          risk: data["riskModule"],
          orderList: data["orderList.allList"]["table"],
          stateData:data["orderList.allList"]["orderStatusEnum"],
          recordList: data["reviewRiskList.tableModule"],
          authModule:data["authModule"],
          applyOrder: data["authModule"]["historyApplication"],
          borrowInfo: data["authModule"]["historyBorrow"]
        };
        this.statusEnum=data["authModule"]['statusEnum'];
        this.phoneForm = this.fb.group({ phoneNumber: [ null], msg: [ null ], });
        // this.initApplyOrderData();
        // this.initBorrowInfoData();
        // this.initialTable();
        // this.initialRecordTable();
      });
  }
  initData(){
    this.getCurrentStaffId();//查询本登录人员的信审员工id


    this.getOrderInfo();
    this.getUserInfo();
    this.getUserWorkInfo();
    this.getDeviceInfo();
    this.getUserContact();
    this.getKtpCheckInfo();
    this.getLivingCheckInfo();
    this.riskIdentification();
    this.getCreditDeviceInfo();
    this.getAdvanceInfo();
    // this.getCreditScore();
    // this.getTelecomScore();
    this.getListHistoryBorrowOrder();
    this.getFaceBlacklistData(false);
    this.getListMsisdnData();
    this.getListMsisdnManualRecordData();
    // this.transfer(0);
    setTimeout(()=>{
      $("[data-magnify=gallery]").magnify();
    },50);
  }
  getCurrentStaffId(){
    this.usrSer.getCurrentStaffId()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            console.log(res.data);
            this.staffData=<Object>res.data;
          }
        });
  }
  getOrderInfo(){
    let data={
      creditOrderId : this.orderId
    };
    this.usrSer.getOrderInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.orderInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getUserInfo(){
    let data={
      orderId : this.orderId
    };
    this.usrSer.getUserInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userInfoData = (<Array<Object>>res.data);
            setTimeout(()=>{
              $("[data-magnify=gallery]").magnify();
            },30);
          }
        });
  }
  getUserWorkInfo(){
    let data={
      orderId : this.orderId
    };
    this.usrSer.getUserWorkInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userWorkInfoData = (<Array<Object>>res.data);
            setTimeout(()=>{
              $("[data-magnify=gallery]").magnify();
            },30);
          }
        });
  }
  getCreditScore(){
    let data={
      userId : this.userId
    };
    this.usrSer.getCreditScore(data)
      .pipe(
        filter((res: Response) => {
          this.getAdvanceInfo();
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.creditScore = res.data;
          }
        });
  }
  getTelecomScore(){
    let data={
      userId : this.userId
    };
    this.usrSer.getTelecomScore(data)
      .pipe(
        filter((res: Response) => {
          this.getAdvanceInfo();
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.telecomScore = res.data;
          }
        });
  }
  getDeviceInfo(){
    let data={
      creditOrderId : this.orderId
    };
    this.usrSer.getDeviceInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.deviceInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getUserContact(){
    let data={
      orderId : this.orderId
    };
    this.usrSer.getUserContact(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.userContactData = (<Array<Object>>res.data).filter(v=>{
              return v['contactGrade']>0;
            });
            this.phoneData = (<Array<Object>>res.data).sort(function compareFunction(a,b){
              return a['contactName'].localeCompare(b['contactName']);
            });
            this.phoneList = (<Array<Object>>res.data).sort(function compareFunction(a,b){
              return a['contactName'].localeCompare(b['contactName']);
            });
          }
        });
  }
  setContactState(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.getUserContact();
        });
  }
  getKtpCheckInfo(){
    let data={
      userId : this.userId,
      creditOrderId : this.orderId
    };
    this.usrSer.getKtpCheckInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.ktpCheckInfoData = (<Array<Object>>res.data);
            setTimeout(()=>{
              $("[data-magnify=gallery]").magnify();
            },30);
          }
        });
  }
  getLivingCheckInfo(){
    let data={
      userId : this.userId,
      creditOrderId : this.orderId
    };
    this.usrSer.getLivingCheckInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.livingCheckInfoData = (<Array<Object>>res.data);
            setTimeout(()=>{
              $("[data-magnify=gallery]").magnify();
            },30);
          }
        });
  }
  riskIdentification(){
    let data={
      creditOrderId : this.orderId
    };
    this.usrSer.riskIdentification(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.riskIdentificationData = (<Array<Object>>res.data);
          }
        });
  }
  getCreditDeviceInfo(){
    let data={
      userId : this.userId
    };
    this.usrSer.getCreditDeviceInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.creditDeviceInfoData = (<Array<Object>>res.data);
          }
        });
  }
  getAdvanceInfo(){
    let data={
      userId : this.userId
    };
    this.usrSer.getAdvanceInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.advanceData = res.data;
            console.log(this.advanceData)
          }
        });
  }
  getListHistoryBorrowOrder(){
    let data={
      userId : this.userId
    };
    this.usrSer.getListHistoryBorrowOrder(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.historyBorrowOrderData = (<Array<Object>>res.data);
          }
        });
  }
  getFaceBlacklistData(param){
    if(this.faceBlacklistData && this.faceBlacklistState==true){
      return;
    }
    let data={
      queryApi:param,
      creditOrderId : this.orderId
    };
    this.usrSer.getFaceBlacklistData(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.faceBlacklistState=param;
          if(res.data){
            this.faceBlacklistData = (<Array<Object>>res.data);
            setTimeout(()=>{
              $("[data-magnify=gallery]").magnify();
            },30);
          }
        });
  }
  getListMsisdnManualRecordData(){
    let data={
      creditOrderId : this.orderId
    };
    this.usrSer.getListMsisdnManualRecord(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.listMsisdnManualRecordData = (<Array<Object>>res.data);
          }
        });
  }

  userAccount:Array<object>;//用户账户
  companyPhone:Array<object>;//公司电话
  getListMsisdnData(){
    let data={
      creditOrderId : this.orderId
    };
    this.usrSer.getListMsisdn(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.loadingState=[];
            this.listMsisdnData = (<Array<Object>>res.data);
            if(this.listMsisdnData && this.listMsisdnData['userMsisdnVOS']){
              this.userAccount=this.listMsisdnData['userMsisdnVOS'].filter(v=>{
                return v['phoneType']==1
              });
              this.companyPhone=this.listMsisdnData['userMsisdnVOS'].filter(v=>{
                return v['phoneType']==2
              });
            }
          }
        });
  }
  detectionState:boolean =false;
  listMsisdnStateData=[];
  phoneNumStatusData=[];
  detectionStatusData=[];
  loadingState=[];
  detection(type,item,id){//检测
    if(this.detectionState==true || this.detectionStatusData[id]==true){
      this.msg.error(this.languagePack['authModule']['quickCheck']['tip']);
      return;
    }
    this.loadingState[id]=true;
    this.detectionStatusData[id]=true;
    let time=setTimeout(()=>{
      this.detectionStatusData[id]=false;
    },9000);
    let data={
      id : item['id'],
      phoneNumber : type==3 ? item['contactPhone'] : item['phoneNumber'],
      phoneNumberType : type,
      creditOrderId : this.orderId
    };
    this.usrSer.queryMsisdnStatus(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.getListMsisdnData();
        });
  }
  edit(key,data) {
    this.listMsisdnStateData[key] = true;
    this.phoneNumStatusData[key] = data;
  }
  save(key,value,item){
    let data={
      id : item['id'],
      phoneNumStatus : value,
      phoneNumberType : item['phoneType']
    };
    this.usrSer.updateUserPhoneStatus(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.listMsisdnStateData[key] = false;
          this.getListMsisdnData();
        });
  }
  saveRelationship(key,value,item){
    let data={
      id : item['id'],
      phoneNumStatus : value
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.listMsisdnStateData[key] = false;
          this.getListMsisdnData();
        });
  }
  oneDetection() {
    if (this.detectionState == true) {
      this.msg.error(this.languagePack['authModule']['quickCheck']['tip']);
      return;
    }
    this.detectionState = true;
    let time = setTimeout(() => {
      this.detectionState = false;
    }, 9000);
    this.loadingState['userAccount'] = true;
    this.loadingState['companyPhone'] = true;
    this.loadingState['relationship0'] = true;
    this.loadingState['relationship1'] = true;
    this.loadingState['relationship2'] = true;
    if (this.listMsisdnData) {
      if (this.listMsisdnData['userContactMsisdnVOS']) {
        this.listMsisdnData['userContactMsisdnVOS'].forEach(v => {
          let data = {
            id: v['id'],
            phoneNumber: v['contactPhone'],
            phoneNumberType: 3,
            creditOrderId: this.orderId
          };
          this.usrSer.queryMsisdnStatus(data)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
              });
        })
      }
      if (this.listMsisdnData['userMsisdnVOS']) {
        this.listMsisdnData['userMsisdnVOS'].forEach(v => {
          let data = {
            id: v['id'],
            phoneNumber: v['phoneNumber'],
            phoneNumberType: v['phoneType'],
            creditOrderId: this.orderId
          };
          this.usrSer.queryMsisdnStatus(data)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
              });
        })
      }
    }
  }
  transfer(type){
    let data={
      creditOrderId : this.orderId,
      type
    };
    this.usrSer.getUserGradeBySelfSupport(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.gradeBySelfSupport = (<Array<Object>>res.data);
          }
        });
  }
  oneRefresh(){
    this.getListMsisdnData();
  }
  manualEntryDetection(phoneNumber){
    if(!phoneNumber){
      return;
    }
    let data={
      phoneNumber : phoneNumber,
      phoneNumberType : 4,
      creditOrderId : this.orderId
    };
    this.usrSer.queryMsisdnStatus(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.getListMsisdnManualRecordData();
        });
  }
  getApplyOrder(){
    let userIds=[];
    userIds.push(this.userId);
    let data={
      userIds : userIds
    };
    this.usrSer.getApplyOrder(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.applyOrderData.data = (< Array<Object> >res.data);
          }
        });
  }
  getBorrowInfo(){
    this.usrSer.getBorrowInfo(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.borrowInfoData.data =(< Array<Object> >res.data);
          }
        });
  }
  getTelecomType(){
    this.usrSer.getTelecomType(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            let data =(res.data);
            if(!data){
              this.telkomselData=[];
              this.indosatData=[];
              this.XLData=[];
            }
            if(data==1){
              this.getTelkomselData();
            }
            if(data==2){
              this.getXLData();
            }
            if(data==3){
              this.getIndosatData();
            }
          }
        });
  }
  getIndosatData(){
    this.usrSer.getIndosatData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.indosatData = res.data;
          }
        });
  }
  getTelkomselData(){
    this.usrSer.getTelkomselData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.telkomselData = res.data;
          }
        });
  }
  getXLData(){
    this.usrSer.getXLData(this.userId)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.XLData = res.data;
          }
        });
  }
  // initApplyOrderData(){
  //   let __this=this;
  //   this.applyOrderData = {
  //     tableTitle: [
  //       {
  //         name: __this.languagePack["applyOrder"]["creditOrderNo"],
  //         reflect: "creditOrderNo",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["applyDate"],
  //         reflect: "applyDate",
  //         type: "text",
  //         filter:(item)=>{
  //           return item['applyDate'] ? unixTime(item['applyDate']) : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["userPhone"],
  //         reflect: "userPhone",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["userGrade"],
  //         reflect: "userGrade",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["auditLimit1"],
  //         reflect: "productVOList",
  //         type: "text",
  //         filter: item => {
  //           const productVOList=item["productVOList"];
  //           if(productVOList.length>0){
  //             let list=productVOList.filter(v=>{
  //               return v['loanProductType']==1
  //             });
  //             return (list && list[0] &&  list[0]['approveAmountMin'] && list[0]['approveAmountMax']) ? list[0]['approveAmountMin']+"-"+ list[0]['approveAmountMax'] : ""
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["auditTerm1"],
  //         reflect: "productVOList",
  //         type: "text",
  //         filter: item => {
  //           const productVOList=item["productVOList"];
  //           if(productVOList.length>0){
  //             let list=productVOList.filter(v=>{
  //               return v['loanProductType']==1
  //             });
  //             return (list && list[0] &&  list[0]['loanTermMix'] && list[0]['loanTermMax']) ? list[0]['loanTermMix']+"-"+ list[0]['loanTermMax'] : ""
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["auditLimit2"],
  //         reflect: "productVOList",
  //         type: "text",
  //         filter: item => {
  //           const productVOList=item["productVOList"];
  //           if(productVOList.length>0){
  //             let list=productVOList.filter(v=>{
  //               return v['loanProductType']==2
  //             });
  //             return (list && list[0] &&  list[0]['approveAmountMin'] && list[0]['approveAmountMax']) ? list[0]['approveAmountMin']+"-"+ list[0]['approveAmountMax'] : ""
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["auditTerm2"],
  //         reflect: "productVOList",
  //         type: "text",
  //         filter: item => {
  //           const productVOList=item["productVOList"];
  //           if(productVOList.length>0){
  //             let list=productVOList.filter(v=>{
  //               return v['loanProductType']==2
  //             });
  //             return (list && list[0] &&  list[0]['loanTermMix'] && list[0]['loanTermMax']) ? list[0]['loanTermMix']+"-"+ list[0]['loanTermMax'] : ""
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["approveDays"],
  //         reflect: "approveDays",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["approveEffectDay"],
  //         reflect: "approveEffectDay",
  //         type: "text",
  //         filter:(item)=>{
  //           return item['applyDate'] ? unixTime(item['applyDate']) : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["approveExpDay"],
  //         reflect: "approveExpDay",
  //         type: "text",
  //         filter:(item)=>{
  //           return item['applyDate'] ? unixTime(item['applyDate']) : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["adminName"],
  //         reflect: "adminName",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["creditIdea"],
  //         reflect: "creditIdea",
  //         type: "text",
  //         filter: item => {
  //           const creditIdea = item["creditIdea"];
  //           const creditIdeaRemark = item["creditIdeaRemark"];
  //           if (creditIdea == 7) {
  //             return creditIdeaRemark;
  //           } else {
  //             return creditIdea;
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["applyOrder"]["auditOrderStatus"],
  //         reflect: "status",
  //         type: "mark",
  //         markColor: {
  //           "1": "#ec971f",
  //           "2": "#108ee9",
  //           "9": "#d9534f",
  //           "12": "#d9534f"
  //         },
  //         filter: item => {
  //           const status = item["status"];
  //           let name = reviewOrderStatustransform(status);
  //           return name;
  //         }
  //       }
  //     ],
  //     loading: false,
  //     showIndex: true
  //   };
  //   this.getApplyOrder();
  // }
  // initBorrowInfoData(){
  //   let __this=this;
  //   this.borrowInfoData = {
  //     tableTitle: [
  //       {
  //         name: __this.languagePack["borrowInfo"]["creditOrderNo"],
  //         reflect: "creditOrderNo",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["orderNo"],
  //         reflect: "orderNo",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["orderType"],
  //         reflect: "orderType",
  //         type: "text",
  //         filter:(item)=>{
  //           let orderType=__this.languagePack["authModule"]["orderType"];
  //           let name=orderType.filter(v=>{
  //             return v['value']==item["orderType"]
  //           });
  //           return (name && name[0] && name[0]["desc"]) ? name[0]["desc"] : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["createTime"],
  //         reflect: "createTime",
  //         type: "text",
  //         filter:(item)=>{
  //           return item['createTime'] ? unixTime(item['createTime']) : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["applyMoney"],
  //         reflect: "applyMoney",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["limit"],
  //         reflect: "loanDays",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["period"],
  //         reflect: "applyMonth",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["otherFee"],
  //         reflect: "monthAuditCharge",
  //         type: "text",
  //         filter:(item)=>{
  //           let monthAuditCharge=item['monthAuditCharge'];
  //           let monthTechnologyCharge=item["monthTechnologyCharge"];
  //           let money=monthAuditCharge+monthTechnologyCharge;
  //           return money ? money : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["lendRateMoney"],
  //         reflect: "lendRateMoney",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["overDueRateMoney"],
  //         reflect: "overDueRateMoney",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["currentRepay"],
  //         reflect: "realRepayMoney",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["planRepaymentDate"],
  //         reflect: "planRepaymentDate",
  //         type: "text",
  //         filter:(item)=>{
  //           return item['planRepaymentDate'] ? unixTime(item['planRepaymentDate']) : "";
  //         }
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["adminName"],
  //         reflect: "adminName",
  //         type: "text"
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["creditIdea"],
  //         reflect: "creditIdea",
  //         type: "text",
  //         filter: item => {
  //           const creditIdea = item["creditIdea"];
  //           const creditIdeaRemark = item["creditIdeaRemark"];
  //           if (creditIdea == 7) {
  //             return creditIdeaRemark;
  //           } else {
  //             return creditIdea;
  //           }
  //         }
  //       },
  //       {
  //         name: __this.languagePack["borrowInfo"]["auditOrderStatus"],
  //         reflect: "status",
  //         type: "mark",
  //         filter: item => {
  //           const status = item["status"];
  //           let name = reviewOrderStatustransform(status);
  //           return name;
  //         }
  //       }
  //     ],
  //     loading: false,
  //     showIndex: true
  //   };
  //   this.getBorrowInfo();
  // }
  changeStatus(data){
    this.status=data;
  }





  photoInfo: Object;

  isShowCall: boolean = false;
  isBigImg: boolean = false;

  hideMask() {
    this.isShowCall = false;
  }

  showImg(index) {
    $("[data-magnify=gallery]")[index].click();
  }

  dateToString(data){
    if(data){
      return DateObjToString(new Date(data));
    }else {
      return;
    }
  }
  toString(data){
    if(data){
      return unixTime(new Date(data));
    }else {
      return;
    }
  }
  birthPlace(str){
    let data=str.substring(0,str.length-10);
    return data;
  }
  birthday(str){
    let data=str.substring(str.length-10,str.length-1);
    return data;
  }
  setUserLevel(data){
    if(data!=null){
      if(data.indexOf("_")>-1){
        let arr=data.substring(0,data.length-1).split("_");
        let str="";
        arr.forEach(v=>{
          let name=this.userLevelData.filter(item=>{
            return item['id']==v;
          });
          str=name && name[0] ? str+","+name[0]['userLevelName'] : "";
        });
        return str.substring(1,str.length);
      }else{
        let name=this.userLevelData.filter(item=>{
          return item['id']==data;
        });
        return name && name[0] ? name[0]['userLevelName'] : "";
      }
    }
  }
  authDetail(item){
    let data={
      from: "auth",
      status: item["status"],
      usrId: item["userId"],
      order: item["id"],
      applyMoney: item["applyMoney"],
      auditMoney: item["auditMoney"],
      orderNo: item["creditOrderNo"]
    };
    let para = ObjToQueryString(data);
    window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank")
  }
  orderDetail(item){
    console.log(item);
    let paramData={
      order: item['id'],
      userId: item['userId'],
    };
    let para = ObjToQueryString(paramData);
    window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
    // this.router.navigate(['/order/detail'], {
    //   queryParams: {
    //     order: item['id'],
    //     userId: item['userId'],
    //   }
    // });
  }
  setState(data){
    if(data!=null){
      let state=this.languagePack['stateData'];
      let name=state.filter(v=>{
        return v['value']==data
      });
      return (name && name[0] && name[0]["desc"]) ? name[0]["desc"] : "";
    }
  }
  toUpper(data){
    return data!=null ? data.toUpperCase() : "";
  }
  test(data){

    let value=this[data];
    if(value.length>0){
      value=value.replace(/[^0-9]/g,'');
    }
    this[data]=value;
  }
  phoneFn(type: number){
    this.phoneModel = true;
    this.phoneListData = [];
    this.friendInfo = [];
    this.userContactData.forEach(( item, index ) => {
      item['checked'] = false;
      this.friendInfo.push(item)
    });
    this.phoneList.forEach(( item, index ) => {
      item['checked'] = false;
      this.phoneListData.push(item)
    });
    this.phoneMdlType = 1;
    this.phoneType = type;
  }
  phoneOk () {
    this.isOkLoading = true;
    if (this.phoneType == 1) {
      // 打电话
      if( this.phoneCall.length == 0 ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      };
      this.callModal(this.phoneCall);
    } else {
      // 发短信
      let phoneNumber = [];
      let msg = this.phoneForm.value.msg;
      this.phoneArray.forEach((item, index) => {
        item['phone'] == '' ? '' : phoneNumber.push(this.phoneArray[0]['phone'])
      });
      // phoneNumber = phoneNumber.concat(this.choosePhoneArray)
      if( phoneNumber.length == 0 || msg == '' || msg == null ) {
        this.isOkLoading = false;
        this.msg.error(this.languagePack['common']['tips']['notEmpty']);
        return;
      }
      this.addphone(phoneNumber,msg)
    }
    this.phoneModel = false;
    this.choosePhoneArray = [];
  }
  phoneCancel(){
    this.phoneModel = false;
    this.phoneForm.reset();
  }
  addphone (phoneNumber, msg) {
    this.isOkLoading=true;
    let data = {
      msgContent: msg,
      creditOrderId: this.orderId,
      operatorId: this.staffData['id'],
      operatorName: this.staffData['staffName'],
      phoneNumbers: phoneNumber
    };
    this.usrSer.sendMsg(data)
      .pipe(
        filter( (res : Response) => {
          this.isOkLoading = false ;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess() ;
          this.phoneModel = false;
          this.phoneForm.reset();
        }
      );
  }
  // 电话模态框切换
  changePhoneStatus (data: number) {
    this.phoneMdlType=data;
  }
  // 电话添加删除
  addphoneNum () {
    this.phoneArray.push({phone: ''})
  }
  deletephoneNum (item) {
    let index = this.phoneArray.indexOf(item)
    this.phoneArray.splice(index, 1)
  }
  // 多选联系人
  checkAll (event: Event, type: number) {
    let list = [];
    if ( type == 1 ) {
      list = this.friendInfo
    } else if ( type == 2 ) {
      list = this.phoneList
    } else if ( type == 3 ) {
      // list = this.loanDetail
    }
    if ( event ) {
      list.forEach( ( item, index ) => {
        if ( !item['checked'] ) {
          item['checked'] = true
          this.checkEmergent(item)
        }
      })
    } else {
      list.forEach( ( item, index ) => {
        if ( item['checked'] ) {
          item['checked'] = false
          this.checkEmergent(item)
        }
      })
    }
  }
  // 单选联系人
  checkEmergent ( item ) {
    if(this.phoneType==1){
      if(this.phoneMdlType==1){
        if ( item.checked ) {
          this.friendInfo.forEach(( v, index ) => {
            if(v['contactPhone']!=item['contactPhone']){
              v['checked'] = false;
            }else{
              v['checked'] = true;
            }
          });
          this.phoneListData.forEach(( v, index ) => {
            v['checked'] = false;
          });
          this.phoneCall=item['contactPhone'];
        } else {
          this.phoneCall=null;
        }
      }else{
        if ( item.checked ) {
          this.phoneListData.forEach(( v, index ) => {
            if(v['contactPhone']!=item['contactPhone']){
              v['checked'] = false;
            }else{
              v['checked'] = true;
            }
          });
          console.log()
          this.friendInfo.forEach(( v, index ) => {
            v['checked'] = false;
          });
          this.phoneCall=item['contactPhone'];
        } else {
          this.phoneCall=null;
        }
      }
    }else{
      if ( item.checked ) {
        if(this.phoneArray.length==1 && !this.phoneArray[0]['phone']){
          this.phoneArray[0]['phone']=item.contactPhone
        }else{
          this.phoneArray.push({
            phone:item.contactPhone
          })
        }
      } else {
        let index = this.phoneArray.indexOf(item.contactPhone);
        this.phoneArray.splice(index, 1)
      }
    }

  }
  // 拨打电话
  callModal (phone) {
    this.isOkLoading = false;
    let account = 'EasyKlick';
    let password = 'b99846c549c57aa213fa8fe0033afdea';// 后台密码MD5
    let channelKey = 'f323ea1ffd5b4cf68a4e7d4f959955a7';// 后台channelKey
    // let voipAccount = '827404001';
    // let voipPassword = '29884818';// VOIP密码
    let voipAccount = this.staffData["recallPhone"];
    let voipPassword = this.staffData["recallPhonePassword"];// VOIP密码
    let msisdn = phone;// 手机号，请使用0开头格式
    console.log(phone);
    let extendId = 'xs_'+this.orderId;// 自定义的唯一扩展ID-需要绑定此通会话的id，此字段由客户提供，用于将通话记录关联进客户的通话记录中
    //需要回调响应的Url，需要进行URL编码，格式为：http://xxxxx/xxx?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}
    // let postUrl = encodeURI('https://newback.kilatkre.top/urgentRecall/webcall/callback?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}' );
    let postUrl = encodeURI('https://back.mymascash.com/urgentRecall/webcall/callback?extendId={extendId}&startTime={startTime}&endTime={endTime}&feeTime={feeTime}&endDirection={endDirection}&endReason={endReason}&recodingUrl={recodingUrl}' );
    console.log(STI);
    console.log(postUrl);
    STI.call('btn-msisdn', 'div-iframe', account, password, channelKey, voipAccount, voipPassword, msisdn, extendId, postUrl);
    $('#btn-msisdn').click();
  }
  setFriendInfo(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let param={
            orderId : this.orderId
          };
          this.usrSer.getUserContact(param)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
                if(res.data){
                  this.userContactData = (<Array<Object>>res.data).filter(v=>{
                    return v['contactGrade']>0;
                  });
                  this.userContactData = (<Array<Object>>res.data).sort(function compareFunction(a,b){
                    return a['contactName'].localeCompare(b['contactName']);
                  });
                  this.phoneList = (<Array<Object>>res.data);
                  this.friendInfo = [];
                  this.userContactData.forEach(( item, index ) => {
                    item['checked'] = false;
                    this.friendInfo.push(item)
                  });
                }
              });
        });
  }
  setPhoneListData(item,state){
    let data={
      id : item['id'],
      phoneNumStatus : state
    };
    this.usrSer.updateUserContactStatusput(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let param={
            orderId : this.orderId
          };
          this.usrSer.getUserContact(param)
            .pipe(
              filter((res: Response) => {
                if (res.success !== true) {
                  this.Cmsg.operateFail(res.message);
                }
                return res.success === true;
              })
            )
            .subscribe(
              (res: Response) => {
                if(res.data){
                  this.userContactData = (<Array<Object>>res.data).filter(v=>{
                    return v['contactGrade']>0;
                  });
                  this.userContactData = (<Array<Object>>res.data).sort(function compareFunction(a,b){
                    return a['contactName'].localeCompare(b['contactName']);
                  });
                  this.phoneList = (<Array<Object>>res.data);
                  this.phoneListData = [];
                  this.phoneList.forEach(( item, index ) => {
                    item['checked'] = false;
                    this.phoneListData.push(item)
                  });
                }
              });
        });
  }
}
