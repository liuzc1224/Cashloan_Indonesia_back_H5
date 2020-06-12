import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../share/table/table.model';

import { RiskListService } from '../../../service/risk';
import { CommonMsgService } from '../../../service/msg/commonMsg.service';
import { Response } from '../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../service/storage';
import {SearchModel} from './searchModel';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskSetting.component.html",
    styleUrls: ['./riskSetting.component.less']
})
export class riskSettingComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskListService,
        private msg: CommonMsgService,
        private fb: FormBuilder,
        private sgo : SessionStorageService
    ) { };

    ngOnInit() {
        __this = this;

        this.getLanguage();

        this.validateForm = this.fb.group({
            "businessId": [null],
            "exemptionDays": [null, [Validators.required]],
            "status": [null],
            "activate": [null],
            "id": [null],
        });

    };

    languagePack: Object;
    searchModel : SearchModel = new SearchModel() ;
    validateForm: FormGroup;

    getLanguage() {
        this.translateSer.stream(["financeModule.list", 'reviewRiskList','common', 'riskModule', 'reviewRiskList.manageModule','reviewRiskList.riskSetting'])
            .subscribe(
                data => {
                    this.languagePack = {
                      common: data['common'],
                      data: data['financeModule.list'],
                      risk: data['riskModule'],
                      list:data['reviewRiskList'],
                      manage: data['reviewRiskList.manageModule'],
                      table:data['reviewRiskList.riskSetting']['table'],
                    };

                    this.initialTable();
                }
            )
    };

    tableData: TableData;

    initialTable() {
        this.tableData = {
            tableTitle: [
              {
                name: __this.languagePack['table']['number'],
                reflect: "id",
                type: "text"
              },
              {
                name: __this.languagePack['table']['name'],
                reflect: "functionName",
                type: "text"
              }, {
                name: __this.languagePack['table']['remarks'],
                reflect: "remark",
                type: "text"
              }, {
                name: __this.languagePack['table']['type'],
                reflect: "businessId",
                type: "text",
                filter:(item)=>{
                  let type=this.languagePack['list']['riskSetting']['type'];
                  let desc = type.filter(v => {
                    return v.value == item['businessId'];
                  });
                  return (desc && desc[0].desc) ? desc[0].desc : "no";
                }
              }, {
                name: __this.languagePack['table']['required'],
                reflect: "status",
                type: "text",
                filter: (item) => {
                  if(item['id']==5){
                    const status = item['status'];

                    const map = __this.languagePack['manage']['requiredType'];

                    let desc = map.filter(v => {
                      return v.value == status;
                    });
                    return (desc && desc[0].desc) ? desc[0].desc : "no";
                  }else{
                    return "";
                  }
                }
              },{
                name: __this.languagePack['manage']['uncheck'],
                reflect: "exemptionDays",
                type: "text",
                filter: (item) => {
                  if(item['id']==6){
                    return item['exemptionDays']!=null ? item['exemptionDays'] : null;
                  }
                }
              },{
                name: __this.languagePack['manage']['face'],
                reflect: "exemptionDays",
                type: "text",
                filter: (item) => {
                  if(item.id==7){
                    let name=this.languagePack['manage']['faceType'].filter(v=>{
                      return v['value']==item['exemptionDays'];
                    });
                    // this.uncheck= a && a[0] && a[0]['exemptionDays'] ? a[0]['exemptionDays'] : 0;
                    // let b=this.tableData.data.filter(v=>{
                    //   return v['id']==7;
                    // });
                    // let value= b && b[0] && b[0]['exemptionDays'] ? b[0]['exemptionDays'] : null;
                    // console.log(value)
                    // if(value){
                    //   let name=this.languagePack['manage']['faceType'].filter(item=>{
                    //     return item['value']==value
                    //   });
                    //   console.log(name)
                      return name && name[0] && name[0]['desc'] ? name[0]['desc'] : null;
                    // }
                  }
                }
              },{
                name: __this.languagePack['manage']['expirationDate'],
                reflect: "exemptionDays",
                type: "text",
                filter: (item) => {
                  if(item['id']==8){
                    return item['exemptionDays']!=null ? item['exemptionDays'] : null;
                  }
                }
              }, {
                name: __this.languagePack['table']['status'],
                reflect: "activate",
                type: "text",
                filter: (item) => {
                  const activate = item['activate'];
                  if(activate<2){

                    const map = __this.languagePack['manage']['statusType'];

                    let name = map.filter(v => {
                      return v.value == activate;
                    });

                    return (name && name[0].desc) ? name[0].desc : "no";
                  }


                }

              }
            ],
            loading: false,
            showIndex: true,
            btnGroup: {
                title: __this.languagePack['common']['operate']['name'],
                data: [{
                    textColor: "#80accf",
                    name: __this.languagePack['common']['operate']['edit'],
                    // ico : "anticon anticon-pay-circle-o" ,
                    bindFn: (item) => {
                      this.selectItem = item;
                      this.validateForm.patchValue({
                        status: item.status,
                        id: item.id,
                        businessId: item.businessId,
                        exemptionDays: item.exemptionDays,
                        activate: item.activate
                      });
                      // if(item.id==8){
                      //   let a=this.tableData.data.filter(v=>{
                      //     return v['id']==6;
                      //   });
                      //   this.uncheck= a && a[0] && a[0]['exemptionDays'] ? a[0]['exemptionDays'] : 0;
                      //   let b=this.tableData.data.filter(v=>{
                      //     return v['id']==7;
                      //   });
                      //   let value= b && b[0] && b[0]['exemptionDays'] ? b[0]['exemptionDays'] : null;
                      //   console.log(value)
                      //   if(value){
                      //     let name=this.languagePack['manage']['faceType'].filter(item=>{
                      //       return item['value']==value
                      //     });
                      //     console.log(name)
                      //     this.faceType=name && name[0] && name[0]['desc'] ? name[0]['desc'] : null;
                      //     console.log(this.faceType)
                      //   }
                      // }
                      this.riskSetMark = true;
                    }
                }]
            }
        };
        this.getList();
    };
    uncheck: number;
    faceType: string;
    selectItem: object;
    riskSetMark: boolean = false;
    search() {
      this.searchModel.currentPage = 1;
      this.getList();
    }
    getList() {

        this.tableData.loading = true;
      let data=this.searchModel;
        this.service.getSetList(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.msg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] == 0) {
                        this.tableData.data = [];
                    };

                    return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
                })
            )
            .subscribe(
                (res: Response) => {

                    let data_arr = res.data;

                    this.tableData.data = (<Array<Object>>data_arr);

                }
            )
    };

    // hidden:Boolean = false;

    makeNew(){
        let data = this.validateForm.value;
        if(data['id']!=6){
            this.makeLoan(data);
        }else{
            if (data.exemptionDays==null) {
                let msg = this.languagePack['common']['tips']['notEmpty'];

                this.msg.operateFail(msg);
                return;
            }
            this.makeLoan(data);
        }
    }
    makeLoan(data){
        let postData = {
            'businessId': data.businessId,
            'status': data.status,
            'exemptionDays': data.exemptionDays !=null ? data.exemptionDays : 0,
            'activate': data.activate
        }
        this.service.postFaceStatus(postData)
            .pipe(
            filter((res: Response) => {

                if (res.success !== true) {
                this.msg.operateFail(res.message);
                };
                return res.success === true;
            })
            )
            .subscribe(
            (res: Response) => {

                this.msg.operateSuccess();

                this.getList();

                this.riskSetMark = false;
            }
            );
    }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  setInput(data){
      if(data){
        let str=data.replace(/[^\d]/g,'');
        this.validateForm.patchValue({
          exemptionDays : str
        });
      }
  }
  setInputDay(data){
    if(data){
      let str = data.replace(/[^\d.]/g,""); //清除“数字”和“.”以外的字符
      str = str.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的
      str = str.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
      str = str.replace(/^(\-)*(\d+)\.(\d).*$/,'$1$2.$3');//只能输入一位小数
      if(str.indexOf(".")< 0 && str !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        str= parseFloat(str);
      }
      this.validateForm.patchValue({
        exemptionDays : str
      });
    }
  }
}
