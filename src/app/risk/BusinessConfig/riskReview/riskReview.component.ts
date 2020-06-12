import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../share/table/table.model';

import { RiskReviewService } from '../../../service/risk';
import { CommonMsgService } from '../../../service/msg/commonMsg.service';
import { Response } from '../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../service/storage';
import {SearchModel} from './searchModel';
import {MsgService} from '../../../service/msg';

let __this;
@Component({
    selector: "",
    templateUrl: "./riskReview.component.html",
    styleUrls: ['./riskReview.component.less']
})
export class riskReviewComponent implements OnInit {

    constructor(
        private translateSer: TranslateService,
        private service: RiskReviewService,
        private msg : MsgService ,
        private Cmsg: CommonMsgService,
        private fb: FormBuilder,
        private sgo : SessionStorageService
    ) { };

    ngOnInit() {
        __this = this;

        this.getLanguage();

        this.validateForm = this.fb.group({
          id: [null],
          descriptor: [null, [Validators.required]],
          paramName: [null],
          params : [null],
          status : [null],
          type : [null]
        });

    };

    languagePack: Object;
    searchModel : SearchModel = new SearchModel() ;
    validateForm: FormGroup;
  statusEum : Array<Object>;
  status : Array<Object>;
  reviewType;
  userSocialIdentityCode : Object;
  keys:Array<String>;
  isOkLoading : Boolean=false;
  objectKeys = Object.keys;
  arrObj = [];
  paramsObj =[];
    getLanguage() {
        this.translateSer.stream(["financeModule.list", 'common', 'riskModule', 'reviewRiskList.manageModule','reviewRiskList.riskSetting'])
            .subscribe(
                data => {
                    this.languagePack = {
                      common: data['common'],
                      data:data['reviewRiskList.riskSetting'],
                      table:data['reviewRiskList.riskSetting']['table'],
                    };
                    this.statusEum=this.languagePack['data']['state'];
                  this.status=this.languagePack['data']['status'];
                    // this.reviewType=this.languagePack['data']['reviewType'];

                    let obj=[{
                      desc:data['common']['all'],
                      value:""
                    }];
                  this.reviewType=obj.concat((this.languagePack['data']['reviewType']).splice(2,4));
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
                reflect: "paramName",
                type: "text"
              }, {
                name: __this.languagePack['table']['remarks'],
                reflect: "descriptor",
                type: "text"
              }, {
                name: __this.languagePack['table']['type'],
                reflect: "type",
                type: "text",
                filter:(item)=>{
                  const type=item['type'];
                  const name=this.reviewType.filter(v=>{
                    return v['value']==type
                  });
                  return (name && name[0] && name[0]['desc']) ? name[0]['desc'] : "";
                }
              }, {
                name: __this.languagePack['table']['value'],
                reflect: "params",
                type: "text",
                filter:(item)=>{
                  let arr=JSON.parse(JSON.stringify(item['params']));
                  return arr.join(',');
                }
              }, {
                name: __this.languagePack['table']['status'],
                reflect: "status",
                type: "text",
                filter: (item) => {
                  const status = item['status'];
                  let desc = this.statusEum.filter(item => {
                      return item['value'] == status;
                  });
                  return (desc && desc[0]['desc']) ? desc[0]['desc'] : "no";
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
                      let params;
                      if(item['id']==23){
                        this.hid=true;
                        this.service.getUserSocialIdentityCode()
                          .pipe(
                            filter((res : Response) => {
                              if (res.success !== true) {
                                this.Cmsg.fetchFail(res.message);
                              }
                              return res.success === true;
                            })
                          )
                          .subscribe(
                            (res: Response) => {
                              this.userSocialIdentityCode = res.data;
                              this.keys=this.objectKeys(this.userSocialIdentityCode);
                              params=item.params[0]+"";
                              params=params.split('&');
                              this.validateForm.patchValue({
                                id: item.id,
                                descriptor: item.descriptor,
                                paramName: item.paramName,
                                params : params,
                                status : item.status,
                                type : item.type
                              });
                            }
                          );
                      }
                      else if(item['id']==42) {
                        this.hid=true;
                        this.userSocialIdentityCode=this.languagePack['data']['education'];
                        this.keys=this.objectKeys(this.languagePack['data']['education']);
                        params=item.params[0]+"";
                        params=params.split('&');
                        this.validateForm.patchValue({
                          id: item.id,
                          descriptor: item.descriptor,
                          paramName: item.paramName,
                          params : params,
                          status : item.status,
                          type : item.type
                        });
                      }else if(item['id']==43) {
                        this.hid=true;
                        this.userSocialIdentityCode=this.languagePack['data']['province'];
                        this.keys=this.objectKeys(this.languagePack['data']['province']);
                        params=item.params[0]+"";
                        params=params.split('&');
                        console.log(this.keys);
                        this.validateForm.patchValue({
                          id: item.id,
                          descriptor: item.descriptor,
                          paramName: item.paramName,
                          params : params,
                          status : item.status,
                          type : item.type
                        });
                      }else{
                        this.hid=false;
                        this.paramsObj=JSON.parse(JSON.stringify(item.params));
                        this.arrObj=JSON.parse(JSON.stringify(item.params));
                        this.validateForm.patchValue({
                          id: item.id,
                          descriptor: item.descriptor,
                          paramName: item.paramName,
                          params : this.paramsObj,
                          status : item.status,
                          type : item.type
                        });
                      }
                      this.riskSetMark = true;
                    }
                }]
            }
        };
        this.getList();
    };
    search() {
      this.searchModel.currentPage = 1;
      this.getList();
    }
    totalSize: number = 0;
    selectItem: object;
    riskSetMark: boolean = false;
    getList() {
        this.tableData.loading = true;
        let data = this.searchModel;
        this.service.getriskReview(data)
            .pipe(
                filter((res: Response) => {
                    if (res.success !== true) {
                        this.Cmsg.fetchFail(res.message);
                    };

                    this.tableData.loading = false;

                    if (res.data && res.data['length'] == 0) {
                        this.tableData.data = [];
                      this.totalSize = 0;
                    };

                    return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
                })
            )
            .subscribe(
                (res: Response) => {

                  let data_arr = res.data;

                  this.tableData.data = (<Array<Object>>data_arr);
                  if (res.page && res.page.totalNumber)
                    this.totalSize = res.page.totalNumber;
                  else
                    this.totalSize = 0;

                }
            )
    };
    hidden:Boolean = false;
    hid:Boolean = false;
    makeNew(){
      let params=this.validateForm.value['params'];
      let value = this.validateForm.value;
      for(let v of params){
        if(!v){
          this.isOkLoading = false;
          this.msg.error(this.languagePack['common']['tips']['notEmpty']);
          return ;
        }
      }
      console.log(value);
      console.log(this.paramsObj);
      let data = {
        id: value.id,
        descriptor: value.descriptor,
        paramName: value.paramName,
        params : value.params,
        status : value.status,
        type : value.type
      };
      if(value.id==23 || value.id==42 || value.id==43){
        let str=data['params'].join('&');
        data['params']=[];
        data['params'].push(str);
      }
      this.paramsObj=[];
      this.makeLoan(data);
    }
    makeCancel(){
      this.paramsObj=[];
      this.validateForm.reset();
      this.riskSetMark=false;
    }
    makeLoan(data){
      let num = data['params']['length'];
      console.log(num);
      if(num<4){
        for(num;num<4;num++){
          data['params'][num]=null;
        }
      }
      this.service.setriskReview(data)
          .pipe(
          filter((res: Response) => {

              if (res.success !== true) {
              this.Cmsg.operateFail(res.message);
              };
              return res.success === true;
          })
          )
          .subscribe(
          (res: Response) => {

            this.Cmsg.operateSuccess();
            this.riskSetMark = false;
            this.getList();
          });
    }
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  change(i,$event){
    let aa=$event.target.value;
    aa=aa.substring(0,aa.length);
    this.arrObj.splice(i,1,aa);
    console.log(this.arrObj);
    this.validateForm.patchValue({
      params : this.arrObj
    });
  }
  pageChange($size: number, type: string): void {
    if (type == 'size') {
      this.searchModel.pageSize = $size;
    }
    if (type == 'page') {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  };
  exportData(){
    let data = this.searchModel;
    this.service.exportRiskReview(data);
  }
}
