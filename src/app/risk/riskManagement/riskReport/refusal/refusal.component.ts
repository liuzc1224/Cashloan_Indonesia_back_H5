import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { TableData } from '../../../../share/table/table.model';

import { RiskReportService } from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import { unixTime} from '../../../../format';

let __this;
@Component({
  selector: "",
  templateUrl: "./refusal.component.html",
  styleUrls: ['./refusal.component.less']
})
export class RefusalComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskReportService,
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

  getLanguage() {
    this.translateSer.stream(["riskReport.rejection",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.rejection'],
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
          name: __this.languagePack['table']['id'],
          reflect: "auditDateStr",
          type: "text",
          filter : (item) =>{
            const index = __this.tableData.data.findIndex(fruit => fruit == item);
            return (__this.searchModel.currentPage-1)*10+index+1;
          }
        },
        {
          name: __this.languagePack['table']['reason'],
          reflect: "rejectDescribe",
          type: "text"
        }, {
          name: __this.languagePack['table']['rejected'],
          reflect: "inconformityNum",
          type: "text"
        }, {
          name: __this.languagePack['table']['rejectionRatio'],
          reflect: "inconformityRatio",
          type: "text",
          filter : (item) => {
            let inconformityRatio =item['inconformityRatio'];
            if(inconformityRatio!=null){
              return (inconformityRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
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
    let data = this.searchModel;
    let etime = unixTime((<Date>data.createTimeEnd),"y-m-d");
    data.createTimeStart = data.createTimeStart ?  unixTime((<Date>data.createTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.createTimeEnd = data.createTimeEnd ? etime + " 23:59:59" : null;
    let start=(new Date(data.createTimeStart)).getTime();
    let end=(new Date(data.createTimeEnd)).getTime();
    if( start - end >0 ){
      data.createTimeStart=null;
      data.createTimeEnd=null;
    }
    return data;
  }
  getList() {
    this.tableData.loading = true;
    let data=this.searchData();
    this.service.manpowerRejectStatistics(data)
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
    this.getList() ;
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
    this.service.manpowerRejectStatisticsExport(data);
  }
}
