import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { TableData } from "../../../../share/table/table.model";
import { unixTime } from "../../../../format";

import { RiskListService } from "../../../../service/risk";
import { CommonMsgService } from "../../../../service/msg/commonMsg.service";
import { Response } from "../../../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { SessionStorageService } from "../../../../service/storage";
import { DateObjToString, dataFormat } from "../../../../format";
import {UserLevelService} from "../../../../service/productCenter";
import {ObjToQueryString} from "../../../../service/ObjToQueryString";
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import {ChannelH5Service} from "../../../../service/operationsCenter";

let __this;
@Component({
  selector: "",
  templateUrl: "./riskOperaCommon.component.html",
  styleUrls: ["./riskOperaCommon.component.less"]
})
export class riskOperaCommon implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private sgo: SessionStorageService,
    private ChannelH5Service: ChannelH5Service,
    private UserLevelService:UserLevelService,
  ) {}

  ngOnInit() {
    __this = this;
    console.log(this.sgo.get("loginInfo"));

    console.log(this.isSignin);
    console.log(this.isAllocate);
    this.getLanguage();

    this.getAllPackage();
    this.getLoginInfo();
  }
  getLoginInfo(){
    let roleOutputBOS=this.sgo.get("loginInfo")['roleOutputBOS'];
    let name=roleOutputBOS.filter(v=>{
      return v['id']==1
    });
    if(name.length===0){
      this.admin=false;
      this.querySiginStatus();
      this.setBtn();
    }else{
      this.admin=true;
    }

  }
  admin : boolean=false;
  inLoading : boolean=false;
  outLoading : boolean=false;
  isSignin: number;
  isAllocate: number;
  siginData: Object;
  singInBtn: boolean=false;
  attendanceBtn: boolean=false;
  languagePack: Object;
  statusEnum: Array<Object>;
  validateForm: FormGroup;
  roleShowPage: boolean = true;
  creditOrderNo: string;
  makeLoanMark: boolean;
  noteMark: boolean;
  userLevel: Array<Object>;
  promotionData : NzTreeNode[];
  allData:Array<object>;

  getLanguage() {
    this.translateSer.stream(["common", "reviewRiskList.tableModule"]).subscribe(data => {
      this.languagePack = {
        common: data["common"],
        data: data["reviewRiskList.tableModule"]
      };
      this.statusEnum = data["common"]["auditOperaCommon"];
      this.initialTable();
    });
  }

  searchModel: SearchModel = new SearchModel();
  setBtn(){
    let roleOutputBOS=this.sgo.get("loginInfo")['roleOutputBOS'];
    let singIn=roleOutputBOS.filter(v=>{
      return v['id']==1 || v['id']==14
    });
    this.singInBtn=singIn && singIn[0] ? true : false;
    console.log(this.singInBtn);
    let attendance=roleOutputBOS.filter(v=>{
      return v['id']==1  || v['id']==15
    });
    this.attendanceBtn=attendance && attendance[0] ? true : false;
    console.log(this.attendanceBtn)
    console.log(roleOutputBOS);
  }
  changeStatus(status: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  tableData: TableData;
  // getUserLevel(){
  //   let data={
  //     isPage:false
  //   };
  //   this.UserLevelService.getUserLevel(data)
  //     .pipe(
  //       filter( (res : Response) => {
  //         if(res.success === false){
  //           this.msg.fetchFail(res.message) ;
  //         }
  //         return res.success === true;
  //       })
  //     )
  //     .subscribe(
  //       ( res : Response ) => {
  //         this.userLevel = (< Array<Object> >res.data);
  //
  //         //   .filter(item=>{
  //         //   return item['status'] == 1 ;
  //         // });
  //       }
  //     );
  // };
  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["reviewOrderNo"],
          reflect: "creditOrderNo",
          type: "text",
          textData :"creditOrderLockStatus",
          textColor:{
            "false": "#80accf",
            "true": "#de0606",
          },
          fn:(item)=>{
            if(item.status == 9){
              let loginInfoId = this.sgo.get("loginInfo")['id'];
              if(loginInfoId==1){
                this.lockOrder(item)
              }else {
                this.service.getCurrentCreditAuditStaff().subscribe((res: Response) => {
                  if (res.success) {
                    console.log(res.data['productTypeList'].indexOf(item['loanProductType']-0));
                    if(res.data['stageId']==item['stageId'] && res.data['productTypeList'].indexOf(item['loanProductType']-0)>-1){

                      this.lockOrder(item)
                    }else{
                      let data={
                        from: "riskListView",
                        status: item["status"],
                        usrId: item["userId"],
                        order: item["id"],
                        applyMoney: item["applyMoney"],
                        auditMoney: item["auditMoney"],
                        orderNo: item["creditOrderNo"]
                      };
                      let para = ObjToQueryString(data);
                      window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank")
                      // let parentName = this.sgo.get("routerInfo");
                      // this.sgo.set("routerInfo" , {
                      //   parentName :parentName.menuName,
                      //   menuName :__this.languagePack['data']['info']
                      // }) ;
                      // this.router.navigate(["/usr/auth"], {
                      //   queryParams: {
                      //     from: "riskListView",
                      //     status: item["status"],
                      //     usrId: item["userId"],
                      //     order: item["id"],
                      //     applyMoney: item["applyMoney"],
                      //     auditMoney: item["auditMoney"],
                      //     orderNo: item["creditOrderNo"]
                      //   }
                      // });
                    }
                  } else {
                    this.msg.fetchFail(res.message);
                  }
                });

              }
            }else{
              let paramData={
                from: "riskListView",
                status: item["status"],
                usrId: item["userId"],
                order: item["id"],
                applyMoney: item["applyMoney"],
                auditMoney: item["auditMoney"],
                orderNo: item["creditOrderNo"]
              };
              let para = ObjToQueryString(paramData);
              window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");

              // let parentName = this.sgo.get("routerInfo");
              // this.sgo.set("routerInfo" , {
              //   parentName :parentName.menuName,
              //   menuName :__this.languagePack['data']['info']
              // }) ;
              // this.router.navigate(["/usr/auth"], {
              //   queryParams: {
              //     from: "riskList",
              //     status: item["status"],
              //     usrId: item["userId"],
              //     order: item["id"],
              //     applyMoney: item["applyMoney"],
              //     auditMoney: item["auditMoney"],
              //     orderNo: item["creditOrderNo"]
              //   }
              // });
            }
          }
        },
        {
          name: __this.languagePack["data"]["createTime"],
          reflect: "createTimeStr",
          type: "text",
          sort: true,
          sortFn:(sort)=>{
            this.searchModel.isAscend= sort==="top";
            this.getRecordList();
          }
        },
        {
          name: __this.languagePack["data"]["userPhone"],
          reflect: "userPhone",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["userLevel"],
          reflect: "userGrade",
          type: "text",
        },
        {
          name : __this.languagePack["data"]['channelSource'] ,
          reflect : "channelStr" ,
          type : "text" ,
        },{
          name : __this.languagePack["data"]['promotionMethod'] ,
          reflect : "promotionTypeStr" ,
          type : "text" ,
        },{
          name : __this.languagePack["data"]['referrer'] ,
          reflect : "referrerName" ,
          type : "text" ,
        },
        {
          name: __this.languagePack["data"]["productType"],
          reflect: "loanProductType",
          type: "text",
          filter: (item) => {
            const productTypes=__this.languagePack["data"]["productTypes"];
            if(item['loanProductType']!=null){
              let name = productTypes.filter(v => {
                return v['value'] == item['loanProductType'];
              });
              return (name && name[0]['desc']) ? name[0]['desc'] : "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["periodsNumber"],
          reflect: "applyMonth",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["loanAmount"],
          reflect: "applyMoney",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["loanPeriod"],
          reflect: "loanDays",
          type: "text",
          filter: (item) => {
              return (item['loanDays']!=null && item['applyMonth']!=null) ?  (item['loanDays'] * item['applyMonth']) : "";
          }
        },
        {
          name: __this.languagePack["data"]["stage"],
          reflect: "stageName",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["stageLetterReviewer"],
          reflect: "currentAuditStaffName",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["stageAuditResults"],
          reflect: "operationResult",
          type: "text",
          filter: (item) => {
            const operationResult=__this.languagePack["data"]["currentStageRes"];
            if(item['operationResult']!=null){
              let str = operationResult.filter(v => {
                return v['value'] == item['operationResult'];
              });
              return (str && str[0] && str[0]['desc']) ? str[0]['desc'] : "";
            }
          }
        },
        {
          name: __this.languagePack["data"]["opinion"],
          reflect: "operationRemark",
          type: "text"
        }
      ],
      loading: false,
      showIndex: true,
      // btnGroup: {
      //   title: __this.languagePack["common"]["operate"]["name"],
      //   data: [
      //     {
      //       textColor: "#80accf",
      //       name: __this.languagePack["common"]["btnGroup"]["a"],
      //       // ico : "anticon anticon-pay-circle-o" ,
      //       showContion: {
      //         name: "status",
      //         value: [1, 2, 3, 4, 5]
      //       },
      //       bindFn: item => {
      //         this.goAuditDetail(item);
      //       }
      //     }
      //   ]
      // }
    };
    this.getRecordList();
  }
  userId: string = "";
  totalSize: number = 0;
  lockOrder(item){
    this.service.lockOrder(item['id']).subscribe((res: Response) => {
      if (res.success) {
        if (res.data['showAuditButton']) {
          let paramData={
            from: "riskList",
            status: item["status"],
            usrId: item["userId"],
            order: item["id"],
            applyMoney: item["applyMoney"],
            auditMoney: item["auditMoney"],
            orderNo: item["creditOrderNo"]
          };
          let para = ObjToQueryString(paramData);
          window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");

          // let parentName = this.sgo.get("routerInfo");
          // this.sgo.set("routerInfo" , {
          //   parentName :parentName.menuName,
          //   menuName :__this.languagePack['data']['info']
          // }) ;
          // this.router.navigate(["/usr/auth"], {
          //   queryParams: {
          //     from: "riskList",
          //     status: item["status"],
          //     usrId: item["userId"],
          //     order: item["id"],
          //     applyMoney: item["applyMoney"],
          //     auditMoney: item["auditMoney"],
          //     orderNo: item["creditOrderNo"]
          //   }
          // });
        }else{
          let paramData={
            from: "riskListView",
            status: item["status"],
            usrId: item["userId"],
            order: item["id"],
            applyMoney: item["applyMoney"],
            auditMoney: item["auditMoney"],
            orderNo: item["creditOrderNo"]
          };
          let para = ObjToQueryString(paramData);
          window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");


          // let parentName = this.sgo.get("routerInfo");
          // this.sgo.set("routerInfo" , {
          //   parentName :parentName.menuName,
          //   menuName :__this.languagePack['data']['info']
          // }) ;
          // this.router.navigate(["/usr/auth"], {
          //   queryParams: {
          //     from: "riskListView",
          //     status: item["status"],
          //     usrId: item["userId"],
          //     order: item["id"],
          //     applyMoney: item["applyMoney"],
          //     auditMoney: item["auditMoney"],
          //     orderNo: item["creditOrderNo"]
          //   }
          // });
        }
        // let parentName = this.sgo.get("routerInfo");
        // this.sgo.set("routerInfo" , {
        //   parentName :parentName.menuName,
        //   menuName :__this.languagePack['data']['info']
        // }) ;
        // this.router.navigate(["/usr/auth"], {
        //   queryParams: {
        //     from: "riskList",
        //     status: item["status"],
        //     usrId: item["userId"],
        //     order: item["id"],
        //     applyMoney: item["applyMoney"],
        //     auditMoney: item["auditMoney"],
        //     orderNo: item["creditOrderNo"]
        //   }
        // });
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }

   getRecordList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    let applyDateEnd = unixTime(<Date>data.applyDateEnd,"y-m-d");
    data.applyDateBegin =data.applyDateBegin ? unixTime(<Date>data.applyDateBegin,"y-m-d")+" 00:00:00" : null;
    data.applyDateEnd =
      applyDateEnd
        ? applyDateEnd + " 23:59:59"
        : null;
    let start=(new Date(data.applyDateBegin)).getTime();
    let end=(new Date(data.applyDateEnd)).getTime();
    if( start - end >0 ){
      data.applyDateBegin=null;
      data.applyDateEnd=null;
    }
    let approveEffectDayEnd = unixTime(<Date>data.approveEffectDayEnd,"y-m-d");
    data.approveEffectDayBegin =data.approveEffectDayBegin ? unixTime(<Date>data.approveEffectDayBegin,"y-m-d")+" 00:00:00" : null;
    data.approveEffectDayEnd =
      approveEffectDayEnd
        ? approveEffectDayEnd + " 23:59:59"
        : null;
    let approveStart=(new Date(data.approveEffectDayBegin)).getTime();
    let approveEnd=(new Date(data.approveEffectDayEnd)).getTime();
    if( approveStart - approveEnd >0 ){
      data.approveEffectDayBegin=null;
      data.approveEffectDayEnd=null;
    }


    this.service
      .getAuditList(data)
      .pipe(
        filter((res: Response) => {
          console.log(res);
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }

          this.tableData.loading = false;

          if (res.data == null || (res.data && res.data["length"] == 0)) {
            this.tableData.data = [];
            this.totalSize = 0;
          }

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe((res: Response) => {
        if (res["success"] && res["data"]["length"] !== 0) {
          let data_arr = res.data;
          this.tableData.data = <Array<Object>>data_arr;
          this.totalSize = res.page.totalNumber;
        }
      });
  }

  pageChange($size: number, type: string): void {
    if (type == "size") {
      this.searchModel.pageSize = $size;
    }

    if (type == "page") {
      this.searchModel.currentPage = $size;
    }
    this.getRecordList();
  }

  reset() {
    this.searchModel = new SearchModel();
    this.getRecordList();
  }

  search() {
    this.searchModel.currentPage = 1;
    this.getRecordList();
  }

  goSignin() {
    if (this.isAllocate == 2) {
      this.msg.operateFail("今日签到已结束");
      return false;
    }
    this.inLoading=true;
    this.service.goSignin().subscribe((res: Response) => {
      if (res.success) {
        this.getRecordList();
        this.querySiginStatus();
        this.inLoading=false;
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }
  goSignout() {
    this.outLoading=true;
    this.service.goSignOut().subscribe((res: Response) => {
      if (res.success) {
        this.querySiginStatus();
        this.outLoading=false;
      } else {
        this.msg.fetchFail(res.message);
      }
    });
  }
  goAuditDetail(item) {
    let that = this;
    if (item.status == 1) {
      //待审核 code 为9 刷新接口
      this.service.lockOrder(item.id).subscribe((res: Response) => {
        if (res.success) {
          that.router.navigate(["/usr/auth"], {
            queryParams: {
              from: "riskList",
              status: item["status"],
              usrId: item["userId"],
              order: item["id"],
              applyMoney: item["applyMoney"],
              userGrade: item['userGrade']
            }
          });
        } else {
          that.msg.fetchFail(res.message);
          if (res.code == 9) {
            that.getRecordList();
          }
        }
      });
    } else {
      let paramData={
        from: "riskList",
        status: item["status"],
        usrId: item["userId"],
        order: item["id"],
        applyMoney: item["applyMoney"],
        auditMoney: item["auditMoney"],
        userGrade: item['userGrade']
      };
      let para = ObjToQueryString(paramData);
      window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");

      // this.router.navigate(["/usr/auth"], {
      //   queryParams: {
      //     from: "riskList",
      //     status: item["status"],
      //     usrId: item["userId"],
      //     order: item["id"],
      //     applyMoney: item["applyMoney"],
      //     auditMoney: item["auditMoney"],
      //     userGrade: item['userGrade']
      //   }
      // });
    }
  }
  //查询信审人员签到状态
  querySiginStatus() {
    this.service.querySiginStatus().subscribe((res: Response) => {
      console.log(res);
      if (res["success"] !== true) {
        this.msg.fetchFail(res.message);
      }
      if (res["success"] && res["data"] && res["data"]["length"] !== 0) {
        if (res["data"]["riskAuditDate"]) {
          let riskAuditDateStr = unixTime(res["data"]["riskAuditDate"], "y-m-d");
          res["data"]["riskAuditDateStr"] = riskAuditDateStr;
        }
        this.siginData = res["data"];
        this.isSignin = res["data"]["signInState"];
        this.isAllocate = res["data"]["allocateState"];
      }
    });
  }
  goAttendance() {
    this.router.navigate(["/risk/riskWorkbench/commissioner/riskAttendance"], {
      queryParams: {
        isCommon: true
      }
    });
  }
  dateStr(data){
    if(data){
      if(data.length==19){
        return unixTime(new Date(data),"h:i:s");
      }else{
        return data;
      }
    }
  }
  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      let arr=this.languagePack['data']['method'];
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['desc'],
          key: v['value'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }
    else if(channel==2){
      let arr=this.languagePack['data']['method1'];
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['desc'],
          key: v['value'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }
    else if(channel==3){
      this.promotionData=[];
      let arr=this.allData.filter(v=>{
        return v['mediaSource']!=null
      });
      let node = new Array<NzTreeNode>();
      let option = new Array<NzTreeNodeOptions>();
      for (let v of arr) {
        option.push({
          title: v['mediaSource'],
          key: v['mediaSource'],
          isLeaf: true
        })
      }
      let str=this.languagePack['common']['all'];
      node.push(new NzTreeNode({
          title: str,
          key: "all",
          children: option
        })
      );
      this.promotionData=node;
    }else{
      this.promotionData=[];
      this.searchModel.promotionTypeStr=null;
    }

  }
  getAllPackage(){
    this.ChannelH5Service.allPackage()
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.allData=< Array<Object> >res.data;
        }
      );
  }
}
