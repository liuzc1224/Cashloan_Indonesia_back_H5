import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../../share/table/table.model';

import { RiskListService } from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import {ChannelH5Service} from "../../../../service/operationsCenter";

let __this;
@Component({
  selector: "",
  templateUrl: "./phaseData.component.html",
  styleUrls: ['./phaseData.component.less']
})
export class PhaseDataComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private ChannelH5Service:ChannelH5Service,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };

  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  totalSize: number = 0;
  promotionData : NzTreeNode[];
  allData:Array<object>;


  getLanguage() {
    this.translateSer.stream(["riskReport.phaseData",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.phaseData'],
          };

          this.getAllPackage();
          this.initialTable();
        }
      )
  };

  tableData: TableData;
  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['statisticsTime'],
          reflect: "date",
          type: "text"
        },
        {
          name: __this.languagePack['table']['stageId'],
          reflect: "stageId",
          type: "text"
        }, {
          name: __this.languagePack['table']['stageName'],
          reflect: "stageName",
          type: "text"
        }, {
          name: __this.languagePack['table']['stageType'],
          reflect: "stageType",
          type: "text",
          filter:(item)=>{
            if(item["stageType"]===0){
              return __this.languagePack['table']['js']
            }else{
              return __this.languagePack['table']['rgsh']
            }
          }
        }, {
          name: __this.languagePack['table']['trials'],
          reflect: "auditCount",
          type: "text",
          filter:(item)=>{
            if(item["auditCount"]===null){
              return 0
            }else{
              return item["auditCount"]
            }
          }
        }, {
          name: __this.languagePack['table']['passes'],
          reflect: "auditPassCount",
          type: "text",
          filter:(item)=>{
            if(item["auditPassCount"]===null){
              return 0
            }else{
              return item["auditPassCount"]
            }
          }
        },
        {
          name: __this.languagePack['table']['rejections'],
          reflect: "auditRefuseCount",
          type: "text",
          filter:(item)=>{
            if(item["auditRefuseCount"]===null){
              return 0
            }else{
              return item["auditRefuseCount"]
            }
          }
        },
        {
          name: __this.languagePack['table']['manualReviewClosed'],
          reflect: "closeCreditCountToday",
          type: "text",
          filter:(item)=>{
            if(item["closeCreditCountToday"]===null){
              return 0;
            }else{
              return item["closeCreditCountToday"]
            }
          }
        }
      ],
      loading: false,
    };
    this.getList();
  };
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  getList() {
    this.tableData.loading = true;

    if(this.searchModel.rangeDate===null||this.searchModel.rangeDate[0]==null){
      this.searchModel.timeStart="";
      this.searchModel.timeEnd="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.timeStart=startTimeString;
      this.searchModel.timeEnd=endTimeString;
    }

    let data=this.searchModel;
    this.service.getStageList(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          };

          this.tableData.loading = false;

          if (res.data && res.data['length'] === 0) {
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
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }
        }
      )
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    };
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
    this.getList() ;
  };
  downloadStageList(){
    if(this.searchModel.rangeDate===null||this.searchModel.rangeDate[0]==null){
      this.searchModel.timeStart="";
      this.searchModel.timeEnd="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.timeStart=startTimeString;
      this.searchModel.timeEnd=endTimeString;
    }
    this.service.downloadStageList(this.searchModel)
  }

  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      let arr=this.languagePack['table']['method'];
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
      let arr=this.languagePack['table']['method1'];
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
};
