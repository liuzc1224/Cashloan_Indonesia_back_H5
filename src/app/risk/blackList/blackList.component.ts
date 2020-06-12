import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SearchModel } from "./searchModel";
import { Adaptor, ObjToArray } from "../../share/tool";
import { TableData } from "../../share/table/table.model";
import { unixTime } from "../../format";

import { BlacklistService } from "../../service/risk";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { filter } from "rxjs/operators";
import { SessionStorageService } from "../../service/storage";
import {  reviewOrderStatustransform } from "../../format";
import {MsgService} from "../../service/msg";

let __this;
@Component({
  selector: "",
  templateUrl: "./blackList.component.html",
  styleUrls: ["./blackList.component.less"]
})
export class blackListComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private service: BlacklistService,
    private msg : MsgService ,
    private Cmsg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private sgo: SessionStorageService
  ) {}

  ngOnInit() {
    __this = this;

    this.getLanguage();
  }

  languagePack: Object;
  isDelete: Boolean =false;
  isDeleteLoading: Boolean =false;
  deleteId : number = null;

  getLanguage() {
    this.translateSer
      .stream(["common", "blackList"])
      .subscribe(data => {
        this.languagePack = {
          common: data["common"],
          data: data["blackList"]
        };

        this.initialTable();
      });
  }

  searchModel: SearchModel = new SearchModel();

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack["data"]["phone"],
          reflect: "phoneNumber",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["ktp"],
          reflect: "ktp",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["creditStatus"],
          reflect: "creditStatusStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["updateTime"],
          reflect: "modifyTimeStr",
          type: "text"
        },
        {
          name: __this.languagePack["data"]["updater"],
          reflect: "modifyUserIdName",
          type: "text",
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack["common"]["operate"]["name"],
        data: [
          {
            textColor: "#80accf",
            name: __this.languagePack["data"]["markNormal"],
            showContion: {
              name: "creditStatus",
              value: [1]
            },
            bindFn: function(item) {
              let obj={
                creditStatus : 0,
                id : item['id']
              };
              __this.updateData(obj);
            }
          },
          {
            textColor: "#80accf",
            name: __this.languagePack["data"]["markBlackList"],
            showContion: {
              name: "creditStatus",
              value: [0,null]
            },
            bindFn: function(item) {
              let obj={
                creditStatus : 1,
                id : item['id']
              };
              __this.updateData(obj);
            }
          },
          {
            textColor: "#de0606",
            name: __this.languagePack["common"]["operate"]["delete"],
            bindFn: function(item) {
              __this.deleteId = item.id;
              __this.isDelete = true;
            }
          }
        ]
      }
    };
    this.getList();
  }

  totalSize: number = 0;

  pageChange($size: number, type: string): void {
    if (type === "size") {
      this.searchModel.pageSize = $size;
    }

    if (type === "page") {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  }

  reset() {
    this.searchModel = new SearchModel();
    this.getList();
  }
  searchData(){
    let model={
      ktp : this.searchModel.ktp,
      creditStatus : this.searchModel.creditStatus,
      phoneNumber : this.searchModel.phoneNumber,
      createTimeStart : this.searchModel.createTimeStart,
      createTimeEnd : this.searchModel.createTimeEnd,
      pageNumber : this.searchModel.pageNumber,
      pageSize : this.searchModel.pageSize,
      currentPage : this.searchModel.currentPage
    };
    let etime = unixTime(<Date>model.createTimeEnd,"y-m-d");
    model.createTimeStart = model.createTimeStart ? unixTime((<Date>model.createTimeStart),"y-m-d")+" 00:00:00" : null;
    model.createTimeEnd = etime ? etime + " 23:59:59" : etime;
    let start=(new Date(model.createTimeStart)).getTime();
    let end=(new Date(model.createTimeEnd)).getTime();
    if( start - end >0 ){
      model.createTimeStart=null;
      model.createTimeEnd=null;
    }
    return model;
  }
  getList(){
    this.tableData.loading=true;
    let model=this.searchData();
    this.service.getBlackList(model)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize =0;
          }
        }
      )
  }
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  deleteCancel(){
    this.isDelete=false;
  }
  deleteOk(){
    this.isDeleteLoading=true;
    this.service.deleteBlackList(this.deleteId)
      .pipe(
        filter( (res : Response) => {
          this.isDeleteLoading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.isDelete=false;
          this.getList();
        }
      );
  }
  updateData(data){
    this.service.updateBlackList(data)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading=false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.Cmsg.operateSuccess();
          this.getList();
        }
      )
  }
  exportData(){
    let model=this.searchData();
    this.service.exportBlackList(model);
  }
  downTemplate(){
    this.service.templateBlackList();
  }
  num(data){
    if(this.searchModel[data]){
      this.searchModel[data]=this.searchModel[data].replace(/[^0-9]/g,'');
    }
  }
  upLoad(){
    this.tableData.loading = true ;
    let file=document.querySelector("#file")['files'][0];
    let formData=new FormData();
    formData.append("file",file);
    this.service.importBlackList(formData)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading = false;
          if(res.success === false){
            this.Cmsg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.getList();
        }
      );
  }
  importList(){
    document.getElementById("file").click();
  }
}
