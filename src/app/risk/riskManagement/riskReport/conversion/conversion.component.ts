import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableData } from '../../../../share/table/table.model';

import { RiskListService } from '../../../../service/risk';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import {SearchModel} from './searchModel';

let __this;
@Component({
  selector: "",
  templateUrl: "./conversion.component.html",
  styleUrls: ['./conversion.component.less']
})
export class ConversionComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };
  topOnLoadData:Object={};
  ngOnInit() {
    __this = this;

    this.getLanguage();
    this.service.onLoadGetConversionTop()
      .subscribe(
        (res: Response) => {
          this.topOnLoadData=res.data;
        }
      );
  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  validateForm: FormGroup;

  getLanguage() {
    this.translateSer.stream(["riskReport.conversion",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.conversion'],
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
          name: __this.languagePack['table']['reviewData'],
          reflect: "auditDateStr",
          type: "text"
        },
        {
          name: __this.languagePack['table']['newLetterReviewOrders'],
          reflect: "applyCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['machineTrialRejection'],
          reflect: "machineTrialRefuseCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['machineReview'],
          reflect: "machineTrialPassCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['manualReview'],
          reflect: "manualAuditPassCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['manualReviewRejection'],
          reflect: "manualAuditRefuseCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['manualReviewClosed'],
          reflect: "closeCreditCountToday",
          type: "text"
        }, {
          name: __this.languagePack['table']['auditPassRate'],
          reflect: "passPercent",
          type: "text",
          filter : (item) => {
            let passPercent =item['passPercent'];
            if(passPercent!=null){
              return (passPercent*100).toFixed(2)+"%"
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

  selectItem: object;
  riskSetMark: boolean = false;
  totalSize: number = 0;
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }

  getList() {

    this.tableData.loading = true;

    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){
      this.searchModel.auditStartDate="";
      this.searchModel.auditEndDate="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.auditStartDate=startTimeString;
      this.searchModel.auditEndDate=endTimeString;
    }

    let data=this.searchModel;
    this.service.getConversionListBottom(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
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
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
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
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  downloadConversionListBottom(){
    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){
      this.searchModel.auditStartDate="";
      this.searchModel.auditEndDate="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.auditStartDate=startTimeString;
      this.searchModel.auditEndDate=endTimeString;
    }
    this.service.downloadConversionListBottom(this.searchModel)
  }
}
