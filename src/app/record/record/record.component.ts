import { Component, Input } from "@angular/core";
import { RecordService } from "../../service/order";
import { TranslateService } from "@ngx-translate/core";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { SearchModel } from "./searchModel";
import { Router } from "@angular/router";
import {orderStatustransform, unixTime} from '../../format';
import {TableData} from '../../share/table/table.model';
import {filter} from 'rxjs/operators';
import {ObjToQueryString} from "../../service/ObjToQueryString";
let __this;
@Component({
  selector: "record",
  templateUrl: "./record.component.html",
  styleUrls: ["./record.component.less"]
})
export class RecordComponent {
  @Input() type: string;
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private recordSer: RecordService,
    private router: Router
  ) {}

  userId: number;
  orderList;
  askList;
  tableData : TableData ;
  totalSize : number ;
  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  statusEnum: Array<{ name: string; value: number }>;
  pageNumber: any = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  ngOnInit() {
    __this=this;
    this.getLanguage();
  }

  getLanguage() {
    this.translateSer
      .stream(["orderList.allList", "common"])
      .subscribe(data => {
        this.languagePack = {
          common : data['common'] ,
          data : data['orderList.allList'],
          table:data['orderList.allList']['table']
        };

        this.statusEnum = data["orderList.allList"]["loanStatus"];
        this.initialTable() ;
      });
  }
  getData(userId: number) {
    this.userId = userId;
    // this.SearchModel.userId = userId;
    this.getOrderList();
  }

  // getAskData(userId: number) {
  //   this.userId = userId;
  //   this.searchModel.userId = userId;
  //   this.getAskList();
  // }
  initialTable(){

    const Table = this.languagePack['table'] ;
    this.tableData = {
      loading : false ,
      showIndex : true,
      tableTitle : [
        {
          name : Table['letterReview'] ,
          reflect : "creditOrderNo" ,
          type : "text" ,
        },{
          name : Table['orderNo'] ,
          reflect : "orderNo" ,
          type : "text" ,
        },{
          name : Table['createTime'] ,
          reflect : "createTime" ,
          type : "text" ,
          filter:(item)=>{
            return item['createTime'] ? unixTime(item['createTime']) : ""
          }
        },{
          name : Table['userNo'] ,
          reflect : "userId" ,
          type : "text" ,
        },{
          name : Table['userName'] ,
          reflect : "userName" ,
          type : "text" ,
        },{
          name : Table['applyCash'] ,
          reflect : "auditMoney" ,
          type : "text" ,
        },
        {
          name : Table['limit'] ,
          reflect : "loanDays" ,
          type : "text"
          // ,
          // filter: (item) => {
          //   const totalPeriod=item['totalPeriod'];
          //   let Day="";
          //   let dayType="";
          //   if(totalPeriod==1){
          //     Day=item["loanDays"];
          //     dayType=__this.languagePack["data"]["dayType"]["day"];
          //   }
          //   if(totalPeriod>1){
          //     Day=item["loanMonths"];
          //     dayType=__this.languagePack["data"]["dayType"]["month"];
          //   }
          //   return (Day && dayType) ? Day+"（"+dayType+"）" : "";
          // }
        },{
          name : Table['applyTime'] ,
          reflect : "payDateStr" ,
          type : "text",
        },{
          name : Table['period']  ,
          reflect : "currentPeriod" ,
          type : "text",
          filter: (item) => {
            const currentPeriod = item['currentPeriod'];
            const totalPeriod = item['totalPeriod'];
            return (currentPeriod && totalPeriod) ? currentPeriod + " / " + totalPeriod : "1/1";
          }
        },{
          name : Table['repayTimeShould']  ,
          reflect : "planRepaymentDate" ,
          type : "text",
          filter:(item)=>{
            return item['planRepaymentDate'] ? unixTime(item['planRepaymentDate']) : ""
          }
        },{
          name : Table['repayMoneyShould']  ,
          reflect : "currentRealRepay" ,
          type : "text",
          filter: (item) => {
            const currentRepay = item['currentRealRepay'];
            return (currentRepay) ? (currentRepay).toFixed(2): "";
          }
        },{
          name : Table['dueDay'] ,
          reflect : "dueDays" ,
          type : "text",
        },{
          name : Table['realRepayMoney'] ,
          reflect : "realRepayMoney" ,
          type : "text" ,
        },{
          name : Table['repaymentDate'] ,
          reflect : "realRepaymentDate" ,
          type : "text",
          filter:(item)=>{
            return item['realRepaymentDate'] ? unixTime(item['realRepaymentDate']) : ""
          }
        },{
          name : Table['orderStatus'] ,
          reflect : "status" ,
          type : "mark" ,
          markColor : {
            "1" : "#ec971f",
            "2" :"#87d068" ,
            "3" : "#1890ff" ,
            "4" : "#1890ff" ,
            "5" : "#d9534f"  ,
            "6" : "#1890ff" ,
            "7" : "#1890ff" ,
            "8" : "#d9534f" ,
            "9" : "#d9534f" ,
            "10" : "#d9534f" ,
            "11" : "#d9534f",
            "12" : "#d9534f",
            "13" : "#d9534f",
            "14" : "#1890ff",
          },
          filter : ( item ) => {
            let status = item['status'] ;
            const totalPeriod=item['totalPeriod'];
            const map = this.statusEnum ;
            if(!item['realRepaymentDateStr']){
              if(status==3){
                status=14;
              }
            }
            let name = map.filter( item => {
              return item.value == status ;
            });
            return (name && name[0].name ) ? name[0].name : "" ;
          },
        }
      ] ,
      btnGroup: {
        title: __this.languagePack['data']['opera']['operate'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['data']['orderDetails'],
          bindFn: (item) => {
            let paramData={
              order: item['id'],
              userId: item['userId'],
            };
            let para = ObjToQueryString(paramData);
            window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
            // this.router.navigate(['/order/detail'], {
            //   queryParams: {
            //     order: item['id'],
            //     userId: item['userId'],
            //   }
            // });
          }
        }]
      }
    };

    this.getOrderList() ;
  };
  goDetail(item: object) {
    this.router.navigate(["/order/detail"], {
      queryParams: {
        order: item["id"],
        userId: item["userId"],
        loanStatus: orderStatustransform(item["status"])
      }
    });
  }

  // orderDtail: Object;
  //
  // getBasicInfo(orderId: number) {
  //   this.recordSer.getBasicInfo(orderId).subscribe((res: Response) => {
  //     this.orderDtail = res.data;
  //   });
  // }

  getOrderList() {
    let data = this.searchModel;
    if (data.status == "null") {
      data.status = "3,4,6,13";
    }
    data.userId = this.userId;
    let etime = unixTime(<Date>data.applyCashDateEnd,"y-m-d");
    data.applyCashDateStart =data.applyCashDateStart ? unixTime(<Date>data.applyCashDateStart,"y-m-d")+" 00:00:00" : null;
    data.applyCashDateEnd =
      etime
        ? etime + " 23:59:59"
        : null;
    let start=(new Date(data.applyCashDateStart)).getTime();
    let end=(new Date(data.applyCashDateEnd)).getTime();
    if( start - end >0 ){
      data.applyCashDateStart=null;
      data.applyCashDateEnd=null;
    }


    this.recordSer.getOrderListInfo(data)
      .pipe(
        filter( ( res : Response) => {
          if(res.success !== true){
            this.msg.fetchFail(res.message) ;
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
    // this.recordSer.getOrderListInfo(data).subscribe(res => {
    //   // res={
    //   //     success:true,
    //   //     data:[
    //   //         {status:3,payDate:1234654},
    //   //         {status:3,payDate:null}
    //   //     ]
    //   // };
    //   if (res["success"] !== true) {
    //     this.msg.fetchFail(res["message"]);
    //   }
    //   if (res["data"] && res["success"]) {
    //     for (let i = 0; i < res["data"]["length"]; i++) {
    //       switch (res["data"][i]["status"]) {
    //         case 3: {
    //           res["data"][i]["statusTxt"] = this.languagePack["data"][
    //             "loanStatus"
    //           ][0]["name"]; //放款中
    //           break;
    //         }
    //         case 4: {
    //           res["data"][i]["statusTxt"] = this.languagePack["data"][
    //             "loanStatus"
    //           ][1]["name"]; //待还款
    //           break;
    //         }
    //         case 6: {
    //           res["data"][i]["statusTxt"] = this.languagePack["data"][
    //             "loanStatus"
    //           ][2]["name"]; //已完成
    //           break;
    //         }
    //         case 13: {
    //           res["data"][i]["statusTxt"] = this.languagePack["data"][
    //             "loanStatus"
    //           ][3]["name"]; //放款失败
    //           break;
    //         }
    //       }
    //     }
    //     for (let i = 0; i < res["data"]["length"]; i++) {
    //       switch (res["data"][i]["orderType"]) {
    //         case 0: {
    //           res["data"][i]["orderTypeTxt"] = this.languagePack["common"][
    //             "orderTypeTxt"
    //           ][0]; //一次性还款付清
    //           break;
    //         }
    //         case 1: {
    //           res["data"][i]["orderTypeTxt"] = this.languagePack["common"][
    //             "orderTypeTxt"
    //           ][1]; //分期等额还款
    //           break;
    //         }
    //       }
    //     }
    //     this.orderList = res["data"];
    //     if (res["page"]) {
    //       this.pageNumber = res["page"]["totalNumber"];
    //       this.currentPage = res["page"]["currentPage"];
    //     }
    //   }
    // });
  }

  getAskList() {
    let data = this.searchModel;
    this.recordSer.getOrderListInfo(data).subscribe((res: Response) => {
      this.askList = res.data;
    });
  }
  changeStatus(status: string) {
    this.searchModel.status = status;
    this.searchModel.currentPage = 1;
    this.getOrderList();
  }
  search() {
    this.searchModel.currentPage = 1;
    this.getOrderList();
  }
  reset() {
    this.searchModel = new SearchModel();
    this.getOrderList();
  }
  changePage(reset: boolean = false) {
    console.log(reset);
    if (reset) {
      this.currentPage = 1;
    }
    console.log(this.currentPage);
    this.getOrderList();
  }
}
