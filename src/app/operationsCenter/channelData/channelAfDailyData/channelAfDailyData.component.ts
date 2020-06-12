import { Component , OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup , FormBuilder, Validators } from '@angular/forms' ;
import {TableData} from '../../../share/table/table.model';
import { unixTime} from '../../../format';
import {CommonMsgService, MsgService} from '../../../service/msg';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage';
import {ObjToArray} from '../../../share/tool';
import {filter} from 'rxjs/operators';
import {SearchModel} from "./searchModel";
import {Response} from '../../../share/model';
import {ChannelService} from '../../../service/operationsCenter';
let __this ;
@Component({
  selector : "" ,
  templateUrl : "./channelAfDailyData.component.html" ,
  styleUrls : ['./channelAfDailyData.component.less']
})
export class ChannelAfDailyDataComponent implements OnInit{

  constructor(
    private translateSer : TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private router : Router ,
    private sgo : SessionStorageService,
    private fb : FormBuilder ,
    private service : ChannelService ,

  ){} ;
  searchModel : SearchModel = new SearchModel() ;
  languagePack : Object ;
  tableData : TableData ;
  validForm : FormGroup;
  isVisible:Boolean=false;
  isOkLoading:Boolean=false;
  channelStatus:Array< String >;
  pagename:Array<string>=[];
  canGetPackageName=true;
  private searchCondition: Object = {};
  ngOnInit(){
    __this = this ;
    this.getLanguage() ;
  };

  getLanguage(){
    this.translateSer.stream(["channelData","common"])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            channelData : data['channelData'],
            list:data['channelData']['table'],
          };
          this.initialTable() ;
        }
      )
  };
  initialTable(){
    this.tableData = {
      loading:false,
      showIndex : false ,
      tableTitle : [
        {
          name : __this.languagePack['channelData']['date'],
          reflect : "installTime" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['channelID'],
          reflect : "id" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['channelName'] ,
          reflect : "name" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['campaign'] ,
          reflect : "ad" ,
          type : "text"
        },
        {
          name : __this.languagePack['list']['packageName'] ,
          reflect : "packageName" ,
          type : "text",
        },
        {
          name : __this.languagePack['list']['downLoad'] ,
          reflect : "downloadCount" ,
          type : "text",
          filter(item){
            return item.downloadCount==null? 0 : item.downloadCount;
          }
        },
        {
          name : __this.languagePack['list']['registered'] ,
          reflect : "registerCount" ,
          type : "text",
          filter(item){
            return item.registerCount==null? 0 : item.registerCount;
          }
        },
        {
          name : __this.languagePack['list']['firstLoanApplication'] ,
          reflect : "firstLoanApplyCount" ,
          type : "text",
          filter(item){
            return item.firstLoanApplyCount==null? 0 : item.firstLoanApplyCount;
          }
        },
        {
          name : __this.languagePack['list']['firstLoanReviewPassed'] ,
          reflect : "firstLoanAuditPassCount" ,
          type : "text",
          filter(item){
            return item.firstLoanAuditPassCount==null? 0 : item.firstLoanAuditPassCount;
          }
        },
        {
          name : __this.languagePack['list']['firstLoanSuccessNumber'] ,
          reflect : "firstLoanCashCount" ,
          type : "text",
          filter(item){
            return item.firstLoanCashCount==null? 0 : item.firstLoanCashCount;
          }
        },
        {
          name : __this.languagePack['list']['completeTheFirstLoan'] ,
          reflect : "firstLoanFinishCount" ,
          type : "text",
          filter(item){
            return item.firstLoanFinishCount==null? 0 : item.firstLoanFinishCount;
          }
        },
        {
          name : __this.languagePack['list']['completeTheSecondLoan'] ,
          reflect : "secondLoanFinishCount" ,
          type : "text",
          filter(item){
            return item.secondLoanFinishCount==null? 0 : item.secondLoanFinishCount;
          }
        },
        {
          name : __this.languagePack['list']['completeMultiLoan'] ,
          reflect : "moreLoanFinishCount" ,
          type : "text",
          filter(item){
            return item.moreLoanFinishCount==null? 0 : item.moreLoanFinishCount;
          }
        },
        {
          name : __this.languagePack['list']['successfulRepayment'] ,
          reflect : "repayFinishCount" ,
          type : "text",
          filter(item){
            return item.repayFinishCount==null? 0 : item.repayFinishCount;
          }
        },
        {
          name : __this.languagePack['list']['firstLoanOverdue'] ,
          reflect : "firstLoanDueCount" ,
          type : "text",
          filter(item){
            return item.firstLoanDueCount==null? 0 : item.firstLoanDueCount;
          }
        },
        {
          name : __this.languagePack['list']['M1IsOverdue'] ,
          reflect : "m1Count" ,
          type : "text",
          filter(item){
            return item.m1Count==null? 0 : item.m1Count;
          }
        },
        {
          name : __this.languagePack['list']['M2IsOverdue'] ,
          reflect : "m2Count" ,
          type : "text",
          filter(item){
            return item.m2Count==null? 0 : item.m2Count;
          }
        },
        {
          name : __this.languagePack['list']['M3IsOverdue'] ,
          reflect : "m3Count" ,
          type : "text",
          filter(item){
            return item.m3Count==null? 0 : item.m3Count;
          }
        }
      ]
    };
    this.getList() ;
  }
  totalSize : number = 0 ;
  getList(){
    this.tableData.loading = true ;
    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){
      this.searchModel.createTimeStart="";
      this.searchModel.createTimeEnd="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.createTimeStart=startTimeString;
      this.searchModel.createTimeEnd=endTimeString;
    }
    let data=this.searchModel;
    this.searchCondition['state']=true;
    let sort = ObjToArray(this.searchCondition);
    data.columns = sort.keys;
    data.orderBy = sort.vals;
    this.service.getAFDailyList(data)
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
  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.getList() ;
  };
  getPackageName(){
    if(this.canGetPackageName==true){
      this.canGetPackageName=false;
      this.service.getPageNameList()
      .subscribe(
        ( res : Response ) => {
          let arr=(< Array<Object> >res.data).filter(v=>{
            return v['packageName']!=null
          });
          arr.forEach(element => {
            this.pagename.push(element["packageName"]);
          });
        }
      );
    }
  };
  downloadAFList(){
    if(this.searchModel.rangeDate==null||this.searchModel.rangeDate[0]==null){
      this.searchModel.createTimeStart="";
      this.searchModel.createTimeEnd="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
      this.searchModel.createTimeStart=startTimeString;
      this.searchModel.createTimeEnd=endTimeString;
    }
    if(this.searchModel.packageName==undefined||this.searchModel.packageName==null){
      this.searchModel.packageName="";
    }
    this.service.downloadAFDailyList(this.searchModel);
  }
}
