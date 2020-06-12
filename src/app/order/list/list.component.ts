import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TableData } from '../../share/table/table.model';
import { CommonMsgService } from '../../service/msg/commonMsg.service';
import { Response } from '../../share/model/reponse.model';
import { SearchModel }from './searchModel'
import { OrderListService } from '../../service/order';
import { filter } from 'rxjs/operators';
import { SessionStorageService } from '../../service/storage';
import { Router } from '@angular/router';
import {ObjToQueryString} from "../../service/ObjToQueryString";
import {NzTreeNode, NzTreeNodeOptions} from "ng-zorro-antd";
import {unixTime} from "../../format";

let __this;
@Component({
  selector : "list" ,
  templateUrl : './list.component.html' ,
  styleUrls : ['./list.component.less']
})
export class ListComponent implements OnInit{
  constructor(
    private translateSer: TranslateService ,
    private msg : CommonMsgService ,
    private orderSer : OrderListService ,
    private sgo : SessionStorageService ,
    private router : Router
  ) {};

  ngOnInit(){
    __this=this;
    this.getLanguage() ;
  };

  searchModel : SearchModel = new SearchModel() ;

  private searchCondition : Object  = {} ;

  statusEnum : Array< { name :string , value : number} > ;
  statusss: Array< { name :string , value : number} > ;
  productType : Object;
  languagePack : Object ;
  userGrade : NzTreeNode[];
  packageName : NzTreeNode[];
  orderTypeData : NzTreeNode[];
  orderStatusData : NzTreeNode[];
  PayPendStatusData : NzTreeNode[];
  orderSettlementTypeData : NzTreeNode[];
  orderCloseTypeData : NzTreeNode[];
  canGetPackageName=true;
  //四大状态/类型提交前临时存储
  orderStatus : string[] =["all"];
  PayPendStatus:any=[];
  orderSettlementType:any=[];
  orderCloseType:any=[];
  promotionData : NzTreeNode[];
  ifjump:any=null;//携带值时则是跳转过来的
  allPackageData:Array<object>;
  allData:Array<object>;
  getLanguage(){
    this.translateSer.stream(["orderList.allList" ,"financeModule.list", 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common : data['common'] ,
            data : data['orderList.allList'],
            list : data['financeModule.list'],
            table:data['orderList.allList']['table']
          };
          this.searchModel.rangeDate=[unixTime(new Date(),"y-M-d"),unixTime(new Date(),"y-M-d")];
          this.statusEnum = data['orderList.allList']['status'];
          this.statusss = data['orderList.allList']['orderStatusEnum'];
          this.productType = data['orderList.allList']['productType'];
          this.orderTypeData=this.nodeData(data['financeModule.list']['type']);
          this.orderStatusData=this.nodeData(data['financeModule.list']['orderStatusList']);
          this.PayPendStatusData=this.nodeData(data['financeModule.list']['PayPendStatusList']);
          this.orderSettlementTypeData=this.nodeData(data['financeModule.list']['orderSettlementTypeList']);
          this.orderCloseTypeData=this.nodeData(data['financeModule.list']['orderCloseTypeList']);
          let init=[];
          let str=this.languagePack['common']['all'];
          init.push(new NzTreeNode({
            title: str,
            key: "all",
            children: []
          }));
          this.userGrade=init;
          this.packageName=init;
          this.getUserLevel();
          this.getPackageName();
          this.initialTable() ;
        }
      )
  };
  nodeData(data){
    let arr=data;
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
    return node;
  }
  tableData : TableData ;
  initialTable(){

    const Table = this.languagePack['table'] ;
    this.tableData = {
      loading : true ,
      showIndex : true,
      tableTitle : [
        {
          name : Table['orderNo'] ,
          reflect : "orderNo" ,
          type : "text" ,
          color : "#00a0e9",
          fn:(item)=>{
            let paramData={
              order: item['id'],
              userId: item['userId'],
            };
            let para = ObjToQueryString(paramData);
            window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
          }
        },{
          name : Table['letterReview'] ,
          reflect : "creditOrderNo" ,
          type : "text" ,
          color : "#00a0e9",
          fn:(item)=>{
            let paramData={
              from: "orderList",
              status: item["orderStatus"],
              usrId: item["userId"],
              order: item["creditOrderId"],
              applyMoney: item["applyMoney"],
              orderNo: item["creditOrderNo"]
            };
            let para = ObjToQueryString(paramData);
            window.open(`${window.location.origin+window.location.pathname}#/usr/auth?${para}`,"_blank");
          }
        },{
          name : Table['createTime'] ,
          reflect : "createTimeStr" ,
          type : "text" ,
        },{
          name : Table['userNo'] ,
          reflect : "userAccount" ,
          type : "text" ,
        },{
          name : Table['userName'] ,
          reflect : "userName" ,
          type : "text" ,
        },{
          name : Table['userLevel'] ,
          reflect : "userGrade" ,
          type : "text" ,
        },{
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
          reflect : "orderType" ,
          type : "text",
          filter : (item)=>{
            return this.productType[item["orderType"]]
          }
        },{
          name : Table['applyCash'] ,
          reflect : "applyMoney" ,
          type : "text",
        },{
          name : Table['limit'] ,
          reflect : "loanDays" ,
          type : "text",
        },{
          name : Table['borrowingPeriod'] ,
          reflect : "totalPeriod" ,
          type : "text",
        },{
          name : Table['packageName'],
          reflect : "packageName",
          type : "text",
        },{
          name : Table['payMoney'] ,
          reflect : "payMoney" ,
          type : "text",
          // filter : (item)=>{
          //   let financingMoney = item['payMoney'];
          //   if(item['orderType']===2){
          //     financingMoney=financingMoney-item['otherCost']
          //   }
          //   return (financingMoney) ? (financingMoney).toFixed(2): "";
          // }
        },{
          name : Table['realPayMoneyTime'] ,
          reflect : "payDateStr" ,
          type : "text",
        },
        // {
        //   name : Table['actualShouldRepayTime'] ,
        //   reflect : "payDateStr" ,
        //   type : "text",
        // },
        {
          name : Table['repayMoneyShould']  ,
          reflect : "currentRepay" ,
          type : "text",
        },{
          name : Table['principal']  ,
          reflect : "principal" ,
          type : "text",
        },{
          name : Table['interest']  ,
          reflect : "interestMoney" ,
          type : "text",
        },{
          name : Table['otherFee'] ,
          reflect : "otherCost" ,
          type : "text",
        },{
          name : Table['overdueFee'] ,
          reflect : "overDueFine" ,
          type : "text",
        },{
          name : Table['autoClear'] ,
          reflect : "autoEndPercent" ,
          type : "text",
          filter : (item)=>{
            if(item['autoEndPercent']===null){
              return ""
            }else{
              return item['autoEndPercent']+"%"
            }
          },
        },{
          name : Table['realRepayMoney'] ,
          reflect : "realRepayMoney" ,
          type : "text",
        },{
          name : Table['repaymentDate'] ,
          reflect : "realRepaymentDateStr" ,
          type : "text",
        },{
          name : Table['clearType'] ,
          reflect : "orderStatus" ,
          type : "text" ,
          filter : ( item ) => {
            let status = item['orderStatus'] ;
            // const totalPeriod=item['totalPeriod'];
            const map = this.statusss ;
            // if(!item['realRepaymentDateStr']){
            //   if(status===3){
            //     status=14;
            //   }
            // }
            let obj = map.filter( item => {
              if(item.value==15||item.value==16||item.value==17||item.value==19||item.value==20||item.value==21){
                return item.value == status ;
              }
            });

            return (obj && obj[0] && obj[0]['desc'] ) ? obj[0]['desc'] : "" ;
          },
        },
        {
          name : Table['dueDay'] ,
          reflect : "dueDays" ,
          type : "text",
        },
        {
          name : Table['orderStatus'] ,
          reflect : "orderStatus" ,
          type: "text",
          // type : "mark" ,
          // markColor : {
          //     "1" : "#ec971f",
          //     "2" : "#87d068" ,
          //     "3" : "#1890ff" ,
          //     "4" : "#1890ff" ,
          //     "5" : "#d9534f"  ,
          //     "6" : "#1890ff" ,
          //     "7" : "#1890ff" ,
          //     "8" : "#d9534f" ,
          //     "9" : "#d9534f" ,
          //     "10" : "#d9534f" ,
          //     "11" : "#d9534f",
          //     "12" : "#d9534f",
          //     "13" : "#d9534f",
          //     "14" : "#1890ff",
          // },
          filter : (item) =>{
            let status = item['orderStatus'] ;
            const map = this.statusss ;
            let obj = map.filter( item => {
              return item.value == status ;
            });

            return (obj && obj[0] && obj[0]['desc'] ) ? obj[0]['desc'] : "" ;
          }
          // filter : ( item ) => {
          //     let status = item['orderStatus'] ;
          //     // const totalPeriod=item['totalPeriod'];
          //     const map = this.statusss ;
          //     // if(!item['realRepaymentDateStr']){
          //     //   if(status===3){
          //     //     status=14;
          //     //   }
          //     // }
          //     let name = map.filter( item => {
          //       return item.value == status ;
          //     });
          //     //由于存在脏数据存在未识别状态导致报错，暂时展示为"Others"，解决后可删除以下3行代码
          //     if(name.length===0){
          //       name=[{"name": "","value": 99999999999999999999}]
          //     }

          //     return (name && name[0].name ) ? name[0].name : "" ;
          // }
        }
      ] ,
      // btnGroup: {
      //   title: __this.languagePack['data']['opera']['operate'],
      //   data: [{
      //     textColor: '#0000ff',
      //     name: __this.languagePack['data']['orderDetails'],
      //     bindFn: (item) => {
      //       let paramData={
      //         order: item['id'],
      //         userId: item['userId'],
      //       };
      //       let para = ObjToQueryString(paramData);
      //       window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
      //
      //       // let parentName = this.sgo.get("routerInfo");
      //       // this.sgo.set("routerInfo" , {
      //       //   parentName :parentName.menuName,
      //       //   menuName :__this.languagePack['data']['info']
      //       // }) ;
      //       // this.router.navigate(['/order/detail'], {
      //       //   queryParams: {
      //       //     order: item['id'],
      //       //     userId: item['userId'],
      //       //   }
      //       // });
      //     }
      //   }]
      // }
    };

    this.getList() ;
  };

  totalSize : number ;

  search(){
    this.searchModel.currentPage = 1 ;
    this.getList() ;
  };
  getData(usrId : number){  //如果从其他页面跳转过来，有携带参数的情况
    this.ifjump=usrId;
    this.getList(usrId)
  }
  serarchData(){
    let data={
      pageSize : this.searchModel.pageSize,
      currentPage : this.searchModel.currentPage,
      userId : this.searchModel.userId,
      loanDaysFlag : this.searchModel.loanDaysFlag,
      loanDays : this.searchModel.loanDays,
      creditOrderNo : this.searchModel.creditOrderNo,
      orderNo : this.searchModel.orderNo,
      referrerName : this.searchModel.referrerName,
      phoneNumber : this.searchModel.phoneNumber,
      userName : this.searchModel.userName,
      firstLoan : this.searchModel.firstLoan,
      channel: this.searchModel.channel,
      rangeDate : this.searchModel.rangeDate,
      columns :this.searchModel.columns,
      orderBy : this.searchModel.orderBy
    };
    if(this.searchModel.rangeDate===null||this.searchModel.rangeDate[0]==null){
      data['createTimeStart']="";
      data['createTimeEnd']="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.rangeDate[0];
      let startTimeString=unixTime(new Date(startTime),"y-M-d")+" 00:00:00";
      let endTime=this.searchModel.rangeDate[1];
      let endTimeString=unixTime(new Date(endTime),"y-M-d")+" 23:59:59";
      data['createTimeStart']=startTimeString;
      data['createTimeEnd']=endTimeString;
    }
    if(this.searchModel.payDate===null||this.searchModel.payDate[0]==null){
      data['payDateStart']="";
      data['payDateEnd']="";
    }else{//否则，以查询的区间为准
      let startTime=this.searchModel.payDate[0];
      let startTimeString=unixTime(new Date(startTime),"y-M-d")+" 00:00:00";
      let endTime=this.searchModel.payDate[1];
      let endTimeString=unixTime(new Date(endTime),"y-M-d")+" 23:59:59";
      data['payDateStart']=startTimeString;
      data['payDateEnd']=endTimeString;
    }
    if(this.searchModel.packageName && this.searchModel.packageName[0] && this.searchModel.packageName[0]=="all"){
      data['packageName']=[];
    }else{
      data['packageName']=this.searchModel.packageName;
    }
    if(this.searchModel.userGrade && this.searchModel.userGrade[0] && this.searchModel.userGrade[0]=="all"){
      data['userGrade']=[];
    }else{
      data['userGrade']=this.searchModel.userGrade;
    }
    if(this.searchModel.orderType && this.searchModel.orderType[0] && this.searchModel.orderType[0]=="all"){
      data['orderType']=[];
    }else{
      data['orderType']=this.searchModel.orderType;
    }
    if(this.searchModel.promotionType && this.searchModel.promotionType[0] && this.searchModel.promotionType[0]=="all"){
      data['promotionType']=[];
    }else{
      data['promotionType']=this.searchModel.promotionType;
    }
    data['orderStatusList']=[];
    data['status']=[];
    if(this.orderStatus && this.orderStatus[0] && this.orderStatus[0]=="all"){
      data['status']=[];
    }else{
      let arr=Array.from(new Set(this.FlatArr(this.orderStatus)));
      let num=arr.indexOf(-100);
      if(num>-1){
        arr.splice(num,1);
        data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat(arr)));
        data['status']=Array.from(new Set([1,11]));
      }else{
        data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat(arr)));
        data['status']=[];
      }
      // data['promotionType']=this.searchModel.promotionType;
    }
    if(this.PayPendStatus && this.PayPendStatus[0] && this.PayPendStatus[0]=="all"){
      data['status']=[];
    }else{
      data['status']=Array.from(new Set(data['status'].concat(this.PayPendStatus)));
    }
    if(this.orderSettlementType && this.orderSettlementType[0] && this.orderSettlementType[0]=="all"){
      data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat([15,16,17,19,20,21])));
    }else{
      data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat(this.orderSettlementType)));
    }
    if(this.orderCloseType && this.orderCloseType[0] && this.orderCloseType[0]=="all"){
      data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat([8,12,9,11,22,23,24])));
    }else{
      data['orderStatusList']=Array.from(new Set(data['orderStatusList'].concat(this.orderCloseType)));
    }
    return data;
  }
  FlatArr(arr){
    if(arr){
      while (arr.some(t=>Array.isArray(t))){
        arr= ([]).concat.apply([],arr);
      }
    }

    return arr;
  }
  getList(usrId?: number){//直接点开该页面是没有参数的，所以这个参数可有可无
    if(usrId){
      // console.log(usrId)
      this.searchModel.userId=usrId
    }
    // // status : Array<any> = [];
    // // orderStatusList :Array<any> = [];
    // this.searchModel.orderStatusList=[];
    // this.searchModel.status=[];
    // // "orderStatus": "订单状态",
    // // "PayPendStatus": "待还款状态",
    // // "orderSettlementType": "订单结清类型",
    // // "orderCloseType": "订单关闭类型"
    // if(this.orderStatus!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderStatus[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    //   let arr1=this.searchModel.status.concat(this.orderStatus[1]);
    //   this.searchModel.status=Array.from(new Set(arr1));
    // }
    // if(this.PayPendStatus!==null){
    //   let arr=this.searchModel.status.concat(this.PayPendStatus[1]);
    //   this.searchModel.status=Array.from(new Set(arr));
    // }
    // if(this.orderSettlementType!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderSettlementType[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    // }
    // if(this.orderCloseType!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderCloseType[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    // }


    let data = this.serarchData() ;
    this.orderSer.getList(data)
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.msg.fetchFail(res.message) ;
          };

          this.tableData.loading = false ;

          if(res.data && res.data['length'] === 0){
            this.tableData.data = [] ;
            this.totalSize = 0 ;
          };

          return res.success === true  && res.data && (< Array<Object>>res.data).length > 0 ;
        })
      )
      .subscribe(
        ( res : Response ) => {

          let data_arr = res.data ;
          // console.log(res.data);
          this.tableData.data = ( <Array< Object > >data_arr );
          this.totalSize = res.page.totalNumber ;

        }
      )
  };
  getPackageName(){
    if(this.canGetPackageName===true){
      this.canGetPackageName=false;
      this.orderSer.getPageNameList()
        .subscribe(
          ( res : Response ) => {
            this.allData=< Array<Object> >res.data;
            // this.packageName=[];
            // console.log(res.data);
            let arr=(< Array<Object> >res.data).filter(v=>{
              return v['packageName']!=null
            });
            let node = new Array<NzTreeNode>();
            let option = new Array<NzTreeNodeOptions>();
            for (let v of arr) {
              option.push({
                title: v['packageName'],
                key: v['packageName'],
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
            this.packageName=node;
            // arr.forEach(element => {
            //   let obj={
            //     id:element["packageName"],
            //     desc:element["packageName"]
            //   };
            //   this.packageName.push(obj);
            // });
            // let obj=[{
            //   id:"",
            //   desc:this.languagePack['common']['all']
            // }];
            // this.packageName=obj.concat(this.packageName);
            // console.log(this.packageName)
          }
        );
    }
  };
  getUserLevel(){
    let data={
      isPage:false
    };
    this.orderSer.getUserLevel(data)
      .pipe(
        filter( (res : Response) => {
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          }
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          let arr=(< Array<Object> >res.data).filter(item=>{
            return item['status'] == 1 ;
          });
          let node = new Array<NzTreeNode>();
          let option = new Array<NzTreeNodeOptions>();
          for (let v of arr) {
            option.push({
              title: v['userLevelName'],
              key: v['userLevelName'],
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
          this.userGrade=node;
        }
      );
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
    this.orderStatus=["all"];
    this.PayPendStatus=[];
    this.orderSettlementType=[];
    this.orderCloseType=[];
    this.searchModel = new SearchModel() ;
    this.searchModel.userId=this.ifjump;
    this.getLanguage() ;
  };
  downloadPageNameList(){
    // this.searchModel.orderStatusList=[];
    // this.searchModel.status=[];
    // // "orderStatus": "订单状态",
    // // "PayPendStatus": "待还款状态",
    // // "orderSettlementType": "订单结清类型",
    // // "orderCloseType": "订单关闭类型"
    // if(this.orderStatus!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderStatus[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    //   let arr1=this.searchModel.status.concat(this.orderStatus[1]);
    //   this.searchModel.status=Array.from(new Set(arr1));
    // }
    // if(this.PayPendStatus!==null){
    //   let arr=this.searchModel.status.concat(this.PayPendStatus[1]);
    //   this.searchModel.status=Array.from(new Set(arr));
    // }
    // if(this.orderSettlementType!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderSettlementType[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    // }
    // if(this.orderCloseType!==null){
    //   let arr=this.searchModel.orderStatusList.concat(this.orderCloseType[0]);
    //   this.searchModel.orderStatusList=Array.from(new Set(arr));
    // }
    // if(this.searchModel.rangeDate===null||this.searchModel.rangeDate[0]==null){
    //   this.searchModel.createTimeStart="";
    //   this.searchModel.createTimeEnd="";
    // }else{//否则，以查询的区间为准
    //   let startTime=this.searchModel.rangeDate[0];
    //   let startTimeString=startTime.getFullYear()+"-"+(startTime.getMonth()+1)+"-"+startTime.getDate()+" 00:00:00";
    //   let endTime=this.searchModel.rangeDate[1];
    //   let endTimeString=endTime.getFullYear()+"-"+(endTime.getMonth()+1)+"-"+endTime.getDate()+" 23:59:59";
    //   this.searchModel.createTimeStart=startTimeString;
    //   this.searchModel.createTimeEnd=endTimeString;
    // }
    // if(!this.searchModel.userGrade){
    //   this.searchModel.userGrade="";
    // }
    // if(!this.searchModel.packageName){
    //   this.searchModel.packageName="";
    // }
    let data = this.serarchData() ;
    this.orderSer.downloadPageNameList(data);
  };
  setSource(){
    let channel=this.searchModel.channel;
    if(channel==1){
      let arr=this.languagePack['list']['method'];
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
      let arr=this.languagePack['list']['method1'];
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
      this.searchModel.promotionType=null;
    }

  }
}
