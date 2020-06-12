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
import {unixTime} from "../../../../format";

let __this;
@Component({
  selector: "",
  templateUrl: "./thirdParty.component.html",
  styleUrls: ['./thirdParty.component.less']
})
export class ThirdPartyComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: RiskListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private sgo : SessionStorageService
  ) { };

  ngOnInit() {
    __this = this;
    let date = new Date()
    let times = date.getTime()
    let hour = date.getHours()
    let minute = date.getMinutes()
    let second = date.getSeconds()
    let nowDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 + 86399000)//拿到当天23:59:59点
    let beforeSevenDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 -518400000);//拿到6天前00:00:00点
    let nowDayString=nowDay.getFullYear()+"-"+(nowDay.getMonth()+1)+"-"+nowDay.getDate()+" 23:59:59";
    let beforeSevenDayString=beforeSevenDay.getFullYear()+"-"+(beforeSevenDay.getMonth()+1)+"-"+beforeSevenDay.getDate()+" 00:00:00";
    this.searchModel.rangeDate=[beforeSevenDayString,nowDayString];
    this.getLanguage();
  };

  languagePack: Object;
  searchModel : SearchModel = new SearchModel() ;
  totalSize: number = 0;
  allRes:any=[];

  getLanguage() {
    this.translateSer.stream(["riskReport.thirdParty",'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['riskReport.thirdParty'],
          };

          this.initialTable();
        }
      )
  };

  tableData: TableData;
  timeLoading : Boolean =false;
  totalData: Array<String>;
  initialTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['table']['callDate'],
          reflect: "day",
          type: "text"
        },
        {
          name: __this.languagePack['table']['livingRecognition'],
          reflect: "yituAliveCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['deviceFingerprint'],
          reflect: "androidFigureCount",
          type: "text"
        }, {
          name: __this.languagePack['table']['authentication'],
          reflect: "identityCheckCount",
          type: "text",
        }, {
          name: __this.languagePack['table']['OCR'],
          reflect: "ocrCheckCount",
          type: "text",
        }, {
          name: __this.languagePack['table']['portraitComparison'],
          reflect: "yituFaceCheckCount",
          type: "text",
        },
        {
          name: __this.languagePack['table']['blacklist'],
          reflect: "blackListCheckCount",
          type: "text"
        },
        {
          name: __this.languagePack['table']['multipleDetection'],
          reflect: "multiCheckCount",
          type: "text"
        },
        {
          name: __this.languagePack['table']['faceBlacklist'],
          reflect: "riskyFaceCheckCount",
          type: "text"
        },
        {
          name: __this.languagePack['table']['creditPoints'],
          reflect: "creditScoreCheckCount",
          type: "text"
        },
        {
          name: __this.languagePack['table']['telecommunications'],
          reflect: "telScoreCheckCount",
          type: "text"
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
    this.searchModel.startDate= this.searchModel.rangeDate[0] ? unixTime(this.searchModel.rangeDate[0], 'y-m-d')+" 00:00:00":null,
    this.searchModel.endDate= this.searchModel.rangeDate[1] ? unixTime(this.searchModel.rangeDate[1], 'y-m-d')+" 23:59:59":null

    // console.log(this.searchModel.rangeDate)
    // if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){//默认是选中查询时间7天以内
    //   let date = new Date()
    //   let times = date.getTime()
    //   let hour = date.getHours()
    //   let minute = date.getMinutes()
    //   let second = date.getSeconds()
    //   let nowDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 + 86399000)//拿到当天23:59:59点
    //   let beforeSevenDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 -518400000);//拿到6天前00:00:00点
    //   let nowDayString=nowDay.getFullYear()+"-"+(nowDay.getMonth()+1)+"-"+nowDay.getDate()+" 23:59:59";
    //   let beforeSevenDayString=beforeSevenDay.getFullYear()+"-"+(beforeSevenDay.getMonth()+1)+"-"+beforeSevenDay.getDate()+" 00:00:00";
    //   this.searchModel.startDate=beforeSevenDayString;
    //   this.searchModel.endDate=nowDayString;
    // }else{//否则，以查询的区间为准
    //   let startTime=this.searchModel.rangeDate[0];
    //   let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
    //   let endTime=this.searchModel.rangeDate[1];
    //   let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
    //   this.searchModel.startDate=startTimeString;
    //   this.searchModel.endDate=endTimeString;
    // }

    let data=this.searchModel;
    // console.log(data)
    this.service.getThirdParty(data)//startDate=2019-9-1 00:00:00&endDate=2019-9-29 23:59:59
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          };

          this.tableData.loading = false;

          if (res.data["thirdInterfaceEveryDay"] && res.data["thirdInterfaceEveryDay"]['length'] == 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          };

          return res.success === true && res.data["thirdInterfaceEveryDay"] && (<Array<Object>>res.data["thirdInterfaceEveryDay"]).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          this.allRes=res.data;
          let data_arr = res.data["thirdInterfaceEveryDay"];
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
  };
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    }
    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    }
    this.getList() ;
  };
  getExportList(){
    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){//默认是选中查询时间7天以内
      let date = new Date()
      let times = date.getTime()
      let hour = date.getHours()
      let minute = date.getMinutes()
      let second = date.getSeconds()
      let nowDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 + 86399000)//拿到当天23:59:59点
      let beforeSevenDay = new Date(times - hour * 3600 * 1000 - minute * 60 * 1000 - second * 1000 -518400000);//拿到6天前00:00:00点
      let nowDayString=nowDay.getFullYear()+"-"+(nowDay.getMonth()+1)+"-"+nowDay.getDate()+" 23:59:59";
      let beforeSevenDayString=beforeSevenDay.getFullYear()+"-"+(beforeSevenDay.getMonth()+1)+"-"+beforeSevenDay.getDate()+" 00:00:00";
      this.searchModel.startDate=beforeSevenDayString;
      this.searchModel.endDate=nowDayString;
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.startDate=startTimeString;
      this.searchModel.endDate=endTimeString;
    }
    this.service.getExportList(this.searchModel)
  };
}
