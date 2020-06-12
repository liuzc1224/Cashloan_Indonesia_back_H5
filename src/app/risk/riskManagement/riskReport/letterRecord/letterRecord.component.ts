import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableData } from '../../../../share/table/table.model';

import {RiskListService, RiskReportService} from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';
import {unixTime} from "../../../../format";
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";

let __this;
@Component({
  selector: "",
  templateUrl: "./letterRecord.component.html",
  styleUrls: ['./letterRecord.component.less']
})
export class LetterRecordComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskReportService,
    private RiskListService: RiskListService,
    private Cmsg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };

  ngOnInit() {
    __this = this;

    this.getLanguage();
  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  validateForm: FormGroup;
  rejectData: Array<object>;
  statusData : NzTreeNode[];
  listAuditRejectDescData : NzTreeNode[];

  getLanguage() {
    this.translateSer.stream(["riskReport.letterRecord",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.letterRecord'],
          };

          this.getStatusData();
          this.getListAuditRejectDesc();
          this.initialTable();
        }
      )
  };

  tableData: TableData;

  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['letterOrderNo'],
          reflect: "creditOrderNo",
          type: "text"
        },
        {
          name: __this.languagePack['table']['stage'],
          reflect: "stageName",
          type: "text"
        }, {
          name: __this.languagePack['table']['operate'],
          reflect: "operationResult",
          type: "text",
          filter:(item)=>{
            let operationResult=item['operationResult'];
            let resultData=__this.languagePack['table']['operateData'];
            if(operationResult!=null){
              if(operationResult==-3){
                return __this.languagePack['table']['machineReview'];
              }
              let obj=resultData.filter(v=>{
                return v['value']==operationResult
              });
              return (obj && obj[0] && obj[0]['desc'] ) ? obj[0]['desc'] : "" ;
            }
          }
        }, {
          name: __this.languagePack['table']['reason'],
          reflect: "auditRejectDsec",
          type: "text",
          width:"200px"
        }, {
          name: __this.languagePack['table']['remarks'],
          reflect: "operationRemark",
          type: "text"
        }, {
          name: __this.languagePack['table']['operator'],
          reflect: "createUserName",
          type: "text"
        }, {
          name: __this.languagePack['table']['operateTime'],
          reflect: "createTime",
          type: "text",
          filter:(item)=>{
            let createTime=item['createTime'];
            return createTime ? unixTime(createTime) : "";
          }
        }
      ],
      loading: false,
      showIndex: true,
    };
    this.getList();
  };

  totalSize: number = 0;
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  searchData(){
    let data = {
      timeStart : this.searchModel.timeStart,
      timeEnd : this.searchModel.timeEnd,
      creditOrderNo : this.searchModel.creditOrderNo!=null ? this.searchModel.creditOrderNo : null,
      operationStatus : this.searchModel.operationStatus!=null ? this.searchModel.operationStatus : null,
      pageSize : this.searchModel.pageSize,
      currentPage : this.searchModel.currentPage,
      columns : this.searchModel.columns,
      orderBy : this.searchModel.orderBy,
    };
    let etime = unixTime((<Date>data.timeEnd),"y-m-d");
    data.timeStart = data.timeStart ?  unixTime((<Date>data.timeStart),"y-m-d")+ " 00:00:00" : null;
    data.timeEnd = data.timeEnd ? etime + " 23:59:59" : null;
    let start=(new Date(data.timeStart)).getTime();
    let end=(new Date(data.timeEnd)).getTime();
    if( start - end >0 ){
      data.timeStart=null;
      data.timeEnd=null;
    }
    if(this.searchModel.stageIdList && this.searchModel.stageIdList[0] && this.searchModel.stageIdList[0]=="all"){
      data['stageIdList']=[];
    }else{
      data['stageIdList']=this.searchModel.stageIdList;
    }
    if(this.searchModel.reject && this.searchModel.reject[0] && this.searchModel.reject[0]=="all"){
      data['aiRejectIdList']=[];
      data['auditRejectIdList']=[];
    }else{
      let arr=this.searchModel.reject;
      data['aiRejectIdList']=[];
      data['auditRejectIdList']=[];
      arr.forEach(v=>{
        if(JSON.parse(v)['type']==0){
          data['aiRejectIdList'].push(JSON.parse(v)['rejectId'])
        }
        if(JSON.parse(v)['type']==1){
          data['auditRejectIdList'].push(JSON.parse(v)['rejectId'])
        }
      });

    }
    return data;
  }
  getList() {
    this.tableData.loading = true;
    let data=this.searchData();
    this.service.creditAuditRecordDetail(data)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;

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
      );
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getLanguage();
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  downloadData(){
    let data=this.searchData();
    this.service.creditAuditRecordDetailExport(data);
  }
  getStatusData(){
    this.RiskListService.listAuditStage()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          if (res.data && res.data['length'] == 0) {
            this.statusData = [];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          let arr=(<Array<Object>>res.data);
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['flowName'],
              key: v['id'],
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
          this.statusData=node;
        }
      )
  }
  getListAuditRejectDesc(){
    this.service.listAuditRejectDesc()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          if (res.data && res.data['length'] == 0) {
            this.listAuditRejectDescData = [];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          this.rejectData=(<Array<Object>>res.data);
          let arr=(<Array<Object>>res.data);
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['rejectDesc'],
              key: JSON.stringify(v),
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
          this.listAuditRejectDescData=node;
        }
      )
  }
}
