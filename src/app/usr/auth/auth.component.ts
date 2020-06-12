import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TableData } from "../../share/table/table.model";

import { UserListService } from "../../service/user";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { filter } from "rxjs/operators";
import { Router } from "@angular/router";
import { SessionStorageService } from "../../service/storage";
import { ActivatedRoute } from "@angular/router";
import { AuthComponent } from "../../share/auth/auth.component";
import { OrderService, UserService } from "../../service/order";
import {ObjToQueryString} from "../../service/ObjToQueryString";
import {RiskListService} from "../../service/risk";

@Component({
  selector: "usr-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.less"]
})
export class UsrAuthComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private RiskListService: RiskListService,
    private usrSer: UserService,
    private routerInfo: ActivatedRoute,
    private service: UserListService,
    private sgo: SessionStorageService,
    private orderSer: OrderService,
    private router: Router
  ) {}

  blacklist : boolean =false;
  isClose : boolean =false;
  stageId;
  ngOnInit() {
    this.getLanguage();
    this.queryAuditRejectDesc();
    this.orderInfo = this.sgo.get("orderInfo");
    this.loginInfo = this.sgo.get("loginInfo");
    let roleOutputBOS=this.sgo.get("loginInfo")['roleOutputBOS'];
    let blacklist=roleOutputBOS.filter(v=>{
      return v['id']==1 || v['id']==16
    });
    this.blacklist=blacklist && blacklist[0] ? true : false;
    this.routerInfo.queryParams.subscribe(para => {
      this.para = para;
      let loginInfoId = this.sgo.get("loginInfo")['id'];
      if(para['from'] == 'riskList' && loginInfoId !=1){
        this.RiskListService.getCurrentCreditAuditStaff().subscribe((res: Response) => {
          if (res.success) {
            this.stageId=res.data['stageId'];
          } else {
            this.msg.fetchFail(res.message);
          }
        });
      }
      this.getOrderInfo(para);
      this.getInfo();
      this.authComponent.getData(this.para["usrId"], this.para["order"]);
      // if (para.from == "riskList") {
      this.initRefuseForm();
      this.initPassForm();
      this.initCloseForm();
      // }
    });

    // let menuInfo = this.sgo.get("menuInfo")["children"];
    //
    // menuInfo.forEach((item, idx) => {
    //   let description = item["menuDescriptions"][0]["description"];
    //   if (description.indexOf("撤回") > -1) {
    //     this.permission = true;
    //   }
    // });
  }

  para: Object;
  languagePack: object;
  permission: boolean;
  isPassLoading: boolean=false;
  isPass: boolean=false;
  closeLoading: boolean=false;
  isRefuse: boolean=false;
  isRefuseLoading: boolean=false;
  orderInfo: Object;
  loginInfo: Object;
  @ViewChild("auth")
  authComponent: AuthComponent;
  refuseForm: FormGroup;
  closeForm: FormGroup;
  passForm: FormGroup;
  rejectDescData: Array<object>;
  userInfo: Object;
  InfoData: Object;

  queryAuditRejectDesc(){
    this.orderSer.queryAuditRejectDesc()
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        console.log(res.data);
        this.rejectDescData=<Array<object>>res.data;
      });
  }
  getInfo(){
    let usrId = this.para['usrId'] ;
    this.usrSer.getPersonalInfo(usrId)
      .pipe(
        filter( (res : Response) => {
          console.log(res);
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          }
          return res.success === true ;
        })
      )
      .subscribe(
        (res : Response ) => {
          this.userInfo = res.data ;
        }
      )
  }
  getOrderInfo(para){
    let data={
      creditOrderId : para["order"]
    };
    this.usrSer.getOrderInfo(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          if(res.data){
            this.InfoData = (<Array<Object>>res.data);
            console.log(this.InfoData);
          }
        });
  }
  initRefuseForm() {
    this.refuseForm = this.fb.group({
      creditOrderId:[this.para["order"]],
      auditRejectId: [null, [Validators.required]],
      creditIdeaRemark: [null],
      isPass: ['false'],
      closeCreditOrder: [false],
    });
  }

  initPassForm() {
    this.passForm = this.fb.group({
      creditOrderId: [this.para["order"]],
      creditIdeaRemark: [null],
      isPass: [true],
      closeCreditOrder: [false],
    });
  }
  initCloseForm() {
    this.closeForm = this.fb.group({
      creditOrderId: [this.para["order"]],
      creditIdeaRemark: [null],
      isPass: ['false'],
      closeCreditOrder: [true],
    });
  }
  getLanguage() {
    this.translateSer
      .stream(["common", "orderList", "reviewRiskList"])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          order: data["orderList"],
          reviewRiskList: data["reviewRiskList"]
        };
      });
  }
  remarks : string="";
  passModal(){
    this.initPassForm();
    this.isPass=true;
  }
  refuseModal(){
    this.initRefuseForm();
    this.isRefuse=true;
  }
  passCancel(){
    this.remarks="";
    this.isPassLoading=false;
    this.isPass=false;
  }
  makePass($event){
    let data=this.passForm.value;
    console.log(data);
    this.isPassLoading=true;
    this.orderSer.riskAudit(data)
      .pipe(
        filter((res: Response) => {
          this.isPassLoading=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.isPass=false;
        this.msg.operateSuccess();
        this.ngOnInit();
        // history.go(-1);
        // this.router.navigate(["/risk/riskWorkbench/commissioner/operPlatCommon"]);
      });
  }
  refuseCancel(){
    this.isRefuseLoading=false;
    this.isRefuse=false;
  }
  closeCancel(){
    this.closeLoading=false;
    this.isClose=false;
  }
  makeRefuse($event){
    if(!this.refuseForm.valid){
      for (const i in this.refuseForm.controls) {
        this.refuseForm.controls[i].markAsDirty();
        this.refuseForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let data=this.refuseForm.value;
    console.log(data);
    this.isRefuseLoading=true;
    this.orderSer.riskAudit(data)
      .pipe(
        filter((res: Response) => {
          this.isRefuseLoading=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.isRefuse=false;
        this.msg.operateSuccess();
        this.ngOnInit();
        // this.router.navigate(["/risk/riskWorkbench/commissioner/operPlatCommon"]);
      });
  }
  return(){
    history.go(-1);
    // this.router.navigate(["/risk/riskWorkbench/commissioner/operPlatCommon"]);
  }
  makeClose($event){
    if(!this.closeForm.valid){
      for (const i in this.closeForm.controls) {
        this.closeForm.controls[i].markAsDirty();
        this.closeForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let data=this.closeForm.value;
    console.log(data);
    this.closeLoading=true;
    this.orderSer.riskAudit(data)
      .pipe(
        filter((res: Response) => {
          this.closeLoading=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.isClose=false;
        this.msg.operateSuccess();
        this.ngOnInit();
      });
  }
  close(){
    this.initCloseForm();
    this.isClose =true;
  }
  addBlacklist(){
    let data={
      id:this.para["usrId"],
      creditStatus:2
    };
    this.orderSer.creditStatus(data)
      .pipe(
        filter((res: Response) => {
          this.isRefuseLoading=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.msg.operateSuccess();
        this.getInfo();
      });
  }
  removeBlacklist(){
    let data={
      id:this.para["usrId"],
      creditStatus:0
    };
    this.orderSer.creditStatus(data)
      .pipe(
        filter((res: Response) => {
          this.isRefuseLoading=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe((res: Response) => {
        this.msg.operateSuccess();
        this.getInfo();
      });
  }

}
