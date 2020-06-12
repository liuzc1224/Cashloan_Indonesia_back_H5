import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Adaptor } from '../../../../share/tool';
import { TableData } from '../../../../share/table/table.model';
import { unixTime} from '../../../../format';
import { CommonMsgService } from '../../../../service/msg/commonMsg.service';
import { Response } from '../../../../share/model/reponse.model';
import { SearchModel }from './searchModel'
import { OrderListService } from '../../../../service/order';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../../../service/storage';
import { Router } from '@angular/router';
import {RiskListService} from "../../../../service/risk";
import {MsgService} from "../../../../service/msg";
import {ObjToQueryString} from "../../../../service/ObjToQueryString";
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import {ChannelH5Service} from "../../../../service/operationsCenter";

let __this;
@Component({
  selector : "audited-list" ,
  templateUrl : './auditedList.component.html' ,
  styleUrls : ['./auditedList.component.less']
})
export class AuditedListComponent implements OnInit{
  constructor(
    private translateSer: TranslateService ,
    private Cmsg : CommonMsgService ,
    private msg : MsgService ,
    private orderSer : OrderListService ,
    private sgo : SessionStorageService ,
    private router : Router,
    private service: RiskListService,
    private ChannelH5Service: ChannelH5Service,
  ) {};

  ngOnInit(){
    __this=this;
    this.getStatusData();
    this.getLanguage() ;
  };

  searchModel : SearchModel = new SearchModel() ;

  statusEnum : Array< { name :string , value : number} > ;

  languagePack : Object ;
  statusData ;
  promotionData : NzTreeNode[];
  allData:Array<object>;

  getLanguage(){
    this.translateSer.stream(["administrator.auditedList" , 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data : data['administrator.auditedList'],
          };

          this.statusEnum = this.languagePack['data']['results'];
          this.getAllPackage();
          this.initialTable() ;
        }
      )
  };
  getStatusData(){
    this.service.listAuditStage()
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.Cmsg.fetchFail(res.message);
          };

          if (res.data && res.data['length'] == 0) {
            this.statusData = this.languagePack['data']['status'];
          };

          return res.success === true && res.data && (<Array<Object>>res.data).length > 0;
        })
      )
      .subscribe(
        (res: Response) => {
          this.statusData = (<Array<Object>>res.data);
          let obj=[{
            flowName:this.languagePack['common']['all'],
            id:""
          }];
          this.statusData=obj.concat(this.statusData);
          // this.statusData=this.statusData.concat(this.languagePack['data']['status']);
          // console.log(this.statusData);
        }
      )
  }
  tableData : TableData ;
  initialTable(){

    const Table = this.languagePack['data'] ;
    this.tableData = {
      loading : false ,
      showIndex : true,
      tableTitle : [
        {
          name : Table['orderNo'] ,
          reflect : "creditOrderNo" ,
          type : "text" ,
          color:"#80accf",
          fn:(item)=> {
            let paramData={
              from: "auditedList",
              status: item["status"],
              usrId: item["userId"],
              order: item["id"],
              applyMoney: item["applyMoney"],
              orderNo: item["creditOrderNo"]
            };
            let para = ObjToQueryString(paramData);
            window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");

            // let parentName = this.sgo.get("routerInfo");
            // this.sgo.set("routerInfo", {
            //   parentName: parentName.menuName,
            //   menuName: __this.languagePack['data']['info']
            // });
            // this.router.navigate(["/usr/auth"], {
            //   queryParams: {
            //     from: "auditedList",
            //     status: item["status"],
            //     usrId: item["userId"],
            //     order: item["id"],
            //     applyMoney: item["applyMoney"],
            //     orderNo: item["creditOrderNo"]
            //   }
            // });
          }
        },{
          name : Table['createTime'] ,
          reflect : "createTime" ,
          type : "text" ,
        },{
          name : Table['phoneNumber'] ,
          reflect : "userPhone" ,
          type : "text" ,
        },{
          name : Table['userLevel'] ,
          reflect : "userGrade" ,
          type : "text" ,
        }, {
          name : Table['channelSource'] ,
          reflect : "channelStr" ,
          type : "text" ,
        },{
          name : Table['promotionMethod'] ,
          reflect : "promotionTypeStr" ,
          type : "text" ,
        },{
          name : Table['referrer'] ,
          reflect : "referrerName" ,
          type : "text" ,
        },{
          name : Table['productType'] ,
          reflect : "loanProductType" ,
          type : "text" ,
          filter: (item) => {
            let loanProductType = item['loanProductType'] ;
            if(loanProductType!=null){
              const map = Table['productTypes'] ;
              let name = map.filter( item => {
                return item.value == loanProductType ;
              });
              return (name && name[0].desc ) ? name[0].desc : "" ;
            }


          }
        },{
          name : Table['periodsNumber'] ,
          reflect : "applyMonth" ,
          type : "text" ,
        },
        {
          name : Table['loanAmount'] ,
          reflect : "applyMoney" ,
          type : "text"
        },{
          name : Table['loanPeriod'] ,
          reflect : "loanDays" ,
          type : "text",
          filter: (item) => {
            return (item['loanDays'] && item['applyMonth']) ? (item['loanDays']*item['applyMonth']) : "" ;
          }
        },{
          name : Table['stage'] ,
          reflect : "stageName" ,
          type : "text",
        },{
          name : Table['letterReviewer']  ,
          reflect : "currentStageStaffName" ,
          type : "text",
        },{
          name : Table['letterReviewTime']  ,
          reflect : "historyAuditTime" ,
          type : "text",
          filter: (item) => {
            let historyAuditTime=item['historyAuditTime'];
            return historyAuditTime ? unixTime(historyAuditTime) : "";
          }
        },{
          name : Table['auditResults']  ,
          reflect : "operationResult" ,
          type : "text",
          filter: (item) => {
            const operationResult=Table["currentStageRes"];
            if(item['operationResult']!=null){
              let str = operationResult.filter(v => {
                return v['value'] == item['operationResult'];
              });
              return (str && str[0] && str[0]['desc']) ? str[0]['desc'] : "";
            }
          }
        },{
          name : Table['letterOpinion']  ,
          reflect : "operationRemark" ,
          type : "text",
        }
      ] ,
    };

    this.getList() ;
  };

  totalSize : number ;
  search() {
    this.searchModel.currentPage = 1;
    this.getList();
  }
  getList(){
    let data = this.searchModel ;
    if(data.createTimeStart || data.createTimeEnd){
      let etime = unixTime((<Date>data.createTimeEnd),"y-m-d");
      data.createTimeStart = data.createTimeStart ?  unixTime((<Date>data.createTimeStart),"y-m-d")+ " 00:00:00" : null;
      data.createTimeEnd = data.createTimeEnd ? etime + " 23:59:59" : null;
      let start=(new Date(data.createTimeStart)).getTime();
      let end=(new Date(data.createTimeEnd)).getTime();
      if( start - end >0 ){
        data.createTimeStart=null;
        data.createTimeEnd=null;
      }
    }
    if(data.historyAuditTimeStart || data.historyAuditTimeEnd){
      let etime = unixTime((<Date>data.historyAuditTimeEnd),"y-m-d");
      data.historyAuditTimeStart = data.historyAuditTimeStart ?  unixTime((<Date>data.historyAuditTimeStart),"y-m-d")+ " 00:00:00" : null;
      data.historyAuditTimeEnd = data.historyAuditTimeEnd ? etime + " 23:59:59" : null;
      let start=(new Date(data.historyAuditTimeStart)).getTime();
      let end=(new Date(data.historyAuditTimeEnd)).getTime();
      if( start - end >0 ){
        data.historyAuditTimeStart=null;
        data.historyAuditTimeEnd=null;
      }
    }
    this.service.getGroupAuditList(data)
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.totalSize = 0 ;
            this.Cmsg.fetchFail(res.message) ;
          };

          this.tableData.loading = false ;

          if(res.data && res.data['length'] == 0){
            this.tableData.data = [] ;
            this.totalSize = 0 ;
          };

          return res.success === true  && res.data && (< Array<Object>>res.data).length > 0 ;
        })
      )
      .subscribe(
        ( res : Response ) => {

          let data_arr = res.data ;
          console.log(res.data);
          this.tableData.data = ( <Array< Object > >data_arr );

          this.totalSize = res.page.totalNumber ;

        }
      )
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

  reset(){
    this.searchModel = new SearchModel() ;
    this.getList()
  };

  changeStatus( status : number ){

    this.searchModel.auditRes = status ;
    this.searchModel.currentPage = 1;

    this.getList() ;
  };
  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      let arr=this.languagePack['data']['method'];
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
      let arr=this.languagePack['data']['method1'];
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
            this.Cmsg.fetchFail(res.message) ;
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
}
