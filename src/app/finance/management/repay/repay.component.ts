import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../../share/table/table.model';
import {RepayListService} from '../../../service/fincial';
import {Response} from '../../../share/model';
import {CommonMsgService, MsgService} from '../../../service/msg';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { DateObjToString, unixTime} from '../../../format';
import {filter} from 'rxjs/operators';
import {OrderService} from '../../../service/order';
import {forkJoin} from 'rxjs';
import {ObjToQueryString} from "../../../service/ObjToQueryString";
let __this;
@Component({
  selector: 'app-repay',
  templateUrl: './repay.component.html',
  styleUrls: ['./repay.component.less']
})
export class RepayComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: RepayListService,
    private msg: CommonMsgService,
    private Cmsg : MsgService ,
    private fb: FormBuilder,
    private router: Router,
    private orderSer: OrderService,
    private order: OrderService
  ) {
  };
  searchModel: SearchModel = new SearchModel();

  private searchCondition: Object = {};
  inputData:Array<Object>;
  searchEnum: Array<Object>;
  languagePack: object;
  operType:Array<Object>;
  hasClearForm: FormGroup;
  selectModel:String="orderNo";
  inputContent:String="";
  statusEnum: Array<Object>;
  maxValue:Number=0;
  status: string;
  loadingRepay: boolean=false;
  reapyEnum: Array<{ name: string, value: number }>;
  CxSerialNumber : Array<Object>;
  repayStatus : Array<Object>;
  settleStatus : Array<Object>;

  tableData: TableData;

  totalSize: number = 0;
  remark: Object;
  readonly :String="readonly";

  ngOnInit() {
    __this = this;
    this.getLanguage();

    this.hasClearForm = this.fb.group({
      'currentRepay': [null, [Validators.required]],//当月应还
      'description': [null],//说明
      'isCancelRepayment': [null],//撤销还款
      'isDone': [null, [Validators.required]],//是否结清
      'orderId': [null, [Validators.required]],//订单ID
      'repayMoney': [null, [Validators.required]],//还款金额
      'repayType': [null, [Validators.required]],//还款方式
      'repaymentDate': [null],//还款时间
      'serialNumber' : [null],//流水号
      'loanType':[null],//订单类型
      'money' : [null],//撤销还款金额
      'repaymentPlanId': [null, [Validators.required]],//还款记录ID
      'manualRepaymentId':[null],
      'realRepayMoney': [null],
      'userId': [null],//用户ID
      'currentPeriod':[null],//当前期数
      'totalPeriod':[null],//总期数
      'operator':1,//
      'operationResult':0
    });

  };

  getLanguage() {
    this.translate.stream(['common', 'financeModule.repayList','financeModule.list'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            repayList: res['financeModule.repayList'],
            list:res['financeModule.list']
          };

          this.getEnum(this.languagePack['repayList']['status1']);
          this.reapyEnum = this.languagePack['repayList']['repayType'];
          this.searchEnum=this.languagePack['list']['search'];
          this.inputData=this.languagePack['list']['type'];
          this.repayStatus=this.languagePack['repayList']['repayStatus'];
          this.settleStatus=this.languagePack['repayList']['settleStatus'];
          this.initTable();
        }
      );
  };
  getEnum(data: Array<Object>) {
    this.statusEnum = data;
  };

  initTable() {
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['repayList']['tabData']['orderNo'],
          reflect: 'orderNO',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['createTime'],
          reflect: 'createTimeStr',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['userAccount'],
          reflect: 'phoneNumber',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['userName'],
          reflect: 'userName',
          type: 'text'
        },
        {
          name: this.languagePack['repayList']['tabData']['type'],
          reflect: 'orderType',
          type: 'text',
          filter:(item) =>{
            let orderType=item['orderType'];
            if(item['orderType']!=null){
              let type=__this.inputData.filter(v => {
                return v.value==item['orderType']
              });
              orderType=(type && type[0].desc) ? type[0].desc : "";
            }
            return (orderType) ? orderType : "";
          }
        },
        {
          name: this.languagePack['repayList']['tabData']['periodsNumber'],
          reflect: 'totalPeriod',
          type: 'text',
          filter: (item) => {
            const currentPeriod = item['currentPeriod'];
            const totalPeriod=item['totalPeriod'];
            if(currentPeriod && totalPeriod){
              return (currentPeriod && totalPeriod) ? currentPeriod+" / "+totalPeriod : "";
            }
          }
        },
        {
          name: this.languagePack['repayList']['tabData']['periodRepayShould'],
          reflect: 'currentLeft',
          type: 'text',
          // filter: (item) => {
          //   let currentRepay = item['currentRepay']+item['overDueFine'];
          //   if(item['loanType']==1){
          //     currentRepay=currentRepay+item['otherCost']
          //   }
          //   return (currentRepay ) ? (currentRepay).toFixed(2): "";
          // }
        },


        {
          name: this.languagePack['repayList']['tabData']['principal'],
          reflect: 'principal',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['interest'],
          reflect: 'interestMoney',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['serviceFee'],
          reflect: 'serveCharge',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['overdueFee'],
          reflect: 'overDueFine',
          type: 'text',
        },
        {
          name: this.languagePack['repayList']['tabData']['repayShouldTime'],
          reflect: 'planRepaymentDateStr',
          type: 'text',
          filter:(item)=>{
            let planRepaymentDateStr=item['planRepaymentDateStr'];
            return planRepaymentDateStr ? unixTime(<Date>planRepaymentDateStr,"y-m-d")+" 23:59:59" : "";
          }
        },
        {
          name: this.languagePack['repayList']['tabData']['overdueDay'],
          reflect: 'dueDays',
          type: 'text',
        },{
          name: this.languagePack['repayList']['tabData']['repayMount'],
          reflect: 'realRepayMoney',
          type: 'text'
        },{
          name: this.languagePack['repayList']['tabData']['repayDate'],
          reflect: 'realRepaymentDateStr',
          type: 'text'
        }, {
          name: this.languagePack['repayList']['tabData']['orderStatus'],
          reflect: 'statusStr',
          type: 'text',
          // filter: (item) => {
          //   const status = item['status'];
          //   const map = __this.languagePack['repayList']['status2'];
          //   let obj = map.filter(item => {
          //     return item.value == status;
          //   });
          //   return (obj && obj[0] && obj[0].desc) ? obj[0].desc : "no";
          // }
        }
      ],
      btnGroup: {
        title: this.languagePack['common']['operate']['name'],
        data: [
          {
            name: this.languagePack['common']['operate']['name'],
            textColor: '#80accf',
            ico: 'anticon anticon-pay-circle-o',
            showContion: {
              name: 'status',
              value: [1, 2, 3, 4, 5,6,11,12,13,14]
            },
            bindFn: (item) => {
              this.selectItem = item;
              this.orderSer.getStream(item['orderId'])
                .pipe(
                  filter((res: Response) => {
                    if (res.success === false) {
                      this.msg.operateFail(res.message);
                    }
                    return res.success === true;
                  })
                )
                .subscribe(
                  (res : Response) => {
                    this.CxSerialNumber=[];
                    let data;
                    if(res.data){
                      data=(< Array<Object> >res.data).filter(item=>{
                        return item['isCancel']==false;
                      });
                      data.forEach(item=>{
                        this.CxSerialNumber.push(
                          {
                            "serialNumber":item['serialNumber'],
                            "money":item['repayMoney'],
                            "manualRepaymentId" : item['id'],
                          }
                        )
                      });
                    }
                    this.hasClearForm.reset();
                    let userId = item.userId;
                    // let currentRepay = item['currentRepay']+item['overDueFine'];
                    // if(item['loanType']==1){
                    //   currentRepay=currentRepay+item['otherCost']
                    // }
                    // this.maxValue=currentRepay - item['realRepayMoney'];
                    this.maxValue=item['currentRepay'];
                    let obj = {
                      'orderId': item['orderId'],
                      // 'repayMoney': (currentRepay-item['realRepayMoney']).toFixed(2),
                      'repayMoney': item['currentLeft'] ? (item['currentLeft']).toFixed(2) : (item['currentRepay']-item['realRepayMoney']).toFixed(2),
                      'realRepayMoney': item['realRepayMoney'] ? (item['realRepayMoney']).toFixed(2) : 0,
                      // 'currentRepay': (currentRepay-item['realRepayMoney']).toFixed(2),//应还
                      'currentRepay': item['currentRepay'] ? (item['currentRepay']).toFixed(2) : 0,//应还
                      'isCancelRepayment': null,//撤销还款
                      'repaymentPlanId': item.id,
                      'userId': userId,
                      'loanType':item['loanType'],
                      'money' : null,//撤销还款金额
                      'isDone':null,
                      'repayType': null,//还款方式,
                      'serialNumber' : null,//流水号
                      'description':'',
                      'manualRepaymentId':null,
                      'repaymentDate':null,
                      'currentPeriod':item['currentPeriod'],
                      'totalPeriod':item['totalPeriod'],
                      'operator':1,
                      'operationResult':0
                    };
                    this.hasClearForm.patchValue(obj);
                    if(this.CxSerialNumber && this.CxSerialNumber.length>0){
                      if(item.status==4 || item.status==6 || item.status==12 || item.status==13 || item.status==14){
                        this.hasClearForm.patchValue({
                          "isDone":1
                        });
                        this.operType=this.languagePack['repayList']['operType1'];
                      }else{
                        this.hasClearForm.patchValue({
                          "isDone":true
                        });
                        this.operType=this.languagePack['repayList']['operType'];
                      }
                      this.hasClearMark = true;
                    }else{
                      if(item.status==9 || item.status==10){
                        return;
                      }else{
                        this.hasClearForm.patchValue({
                          "isDone":false
                        });
                        this.operType=this.languagePack['repayList']['operType2'];
                        this.hasClearMark = true;
                      }
                    }
                  }
                )
            }
          }, {
            textColor: '#6f859c',
            name: this.languagePack['common']['btnGroup']['a'],
            // showContion: {
            //   name: 'status',
            //   value: [1, 2, 3, 4, 5,6,11,12,13,14]
            // },
            bindFn: (item) => {
              const status = item['status'];
              const map = __this.languagePack['repayList']['status2'];
              let name = map.filter(item => {
                return item.value == status;
              });
              let loanStatus = (name && name[0].name) ? name[0].name : 'no';
              let paramData={
                order: item['orderId'],
                userId: item['userId'],
                loanStatus: loanStatus
              };
              let para = ObjToQueryString(paramData);
              window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
              // this.router.navigate(['/order/detail'], {
              //   queryParams: {
              //     order: item['orderId'],
              //     userId: item['userId'],
              //     loanStatus: loanStatus
              //   }
              // });
            }
          }
        ]
      }
    };
    this.getList();
  }

  getList() {
    this.tableData.loading = true;
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
    data.planRepaymentTimeStart = data.planRepaymentTimeStart ?  unixTime((<Date>data.planRepaymentTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.planRepaymentTimeEnd = data.planRepaymentTimeEnd ? unixTime((<Date>data.planRepaymentTimeEnd),"y-m-d") + " 23:59:59" : null;
    let startAudit=(new Date(data.planRepaymentTimeStart)).getTime();
    let endAudit=(new Date(data.planRepaymentTimeEnd)).getTime();
    if( startAudit - endAudit >0 ){
      data.planRepaymentTimeStart=null;
      data.planRepaymentTimeEnd=null;
    }
    data.columns=['order_create_time'];
    data.orderBy=[false];
    // this.searchCondition['status']=false;
    // console.log(data);
    this.service.getList(data)
      .pipe(
        filter((res: Response) => {
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }
          this.tableData.loading = false;
          if (res.data && res.data['length'] == 0) {
            this.tableData.data = [];
            this.totalSize = 0;
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          let data_arr = res.data;
          this.tableData.data = (<Array<Object>>data_arr);
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;
        }
      );
  };

  selectItem: object;

  hasClearMark: boolean = false;
  clearBill($event) {
    let postData = this.hasClearForm.value;
    if(postData.isDone ==false) {
      if (postData.repayType==null) {
        let msg = this.languagePack['repayList']['tips']['repayChannel'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.serialNumber) {
        let msg = this.languagePack['repayList']['tips']['serialNumber'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.repaymentDate) {
        let msg = this.languagePack['repayList']['tips']['repaymentDate'];
        this.Cmsg.error(msg);
        return;
      }
      let post = {
        'currentPeriod':postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],//应还
        'description':postData['description'],
        'isCancelRepayment':false,
        'isDone':false,
        'loanType':postData['loanType'],
        'operationResult':0,
        'operator':1,
        'orderId': postData['orderId'],
        'repayMoney': postData['repayMoney'],
        'repayType': postData['repayType'],//还款方式,
        'repaymentDate':unixTime(postData['repaymentDate']),
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : postData['serialNumber'],//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId']
      };
      this.makeRepay(post);
    }
    if(postData.isDone==true){

      let obj = {
        'currentPeriod':postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],
        'description':postData['description'],
        'isCancelRepayment':false,
        'isDone':true,
        'loanType':postData['loanType'],
        'operationResult':0,
        'operator':1,
        'orderId': postData['orderId'],
        'repayMoney': postData['repayMoney'],//应还
        'repayType': null,//还款方式,
        'repaymentDate':unixTime(new Date()),
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : null,//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId']
      };
      this.makeRepay(obj);
    }
    else if(postData.isDone==1){
      if (!postData.serialNumber) {
        let msg = this.languagePack['repayList']['tips']['serial'];
        this.Cmsg.error(msg);
        return;
      }
      if (!postData.description) {
        let msg = this.languagePack['repayList']['tips']['remark'];
        this.Cmsg.error(msg);
        return;
      }
      let data = {
        'currentPeriod': postData['currentPeriod'],
        'currentRepay': postData['currentRepay'],
        'description': postData['description'],
        'isCancelRepayment': true,
        'isDone': false,
        'loanType':postData['loanType'],
        'operationResult': 0,
        'operator': 1,
        'orderId': postData['orderId'],
        'repayMoney': postData['money'],
        'repayType': null,//还款方式,
        'repaymentDate':  null,
        'repaymentPlanId': postData['repaymentPlanId'],
        'serialNumber' : postData['serialNumber'],//流水号
        'totalPeriod':postData['totalPeriod'],
        'userId': postData['userId'],
        'manualRepaymentId':postData['manualRepaymentId']
      };
      this.makeRepay(data);
    }

    // postData.repaymentDate = DateObjToString(postData.repaymentDate);
    //
    // let target = <HTMLButtonElement>$event.target;
    //
    // target.disabled = true;
    //
    // if (postData.isDone == 'false') {
    //   let currentRepay = this.selectItem['currentRepay'];
    //   let realRepay = postData.repayMoney / 1;
    //   if (realRepay > currentRepay) {
    //     let msg = this.languagePack['common']['tips']['overflow'];
    //     this.msg.operateFail(msg);
    //     target.disabled = false;
    //     return;
    //   }
    //   ;
    // }
    // ;
  };
  makeRepay(postData){
    // postData.repaymentDate = DateObjToString(postData.repaymentDate);
    // if(!postData.repaymentDate){
    //   postData.repaymentDate=DateObjToString( new Date());
    // }
    this.loadingRepay=true;
    this.service.makeRepay(postData)
      .pipe(
        filter((res: Response) => {
          this.loadingRepay=false;
          if (res.success === false) {
            this.msg.operateFail(res.message);
          }
          this.readonly="readonly";
          // target.disabled = false;

          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.msg.operateSuccess();

          this.hasClearMark = false;

          this.getList();
        }
      );
  }
  cancel(){
    this.hasClearMark = false;
    this.hasClearForm.reset();
  }
  change(){
    let result=this.hasClearForm.get('isDone').value;
    if(result==1){

    }
  }
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
  };

  pageChange($size: number, type: string): void {
    if (type == 'size') {
      this.searchModel.pageSize = $size;
    }
    if (type == 'page') {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  };

  search() {
    this.searchModel.currentPage = 1 ;
    let name=this.selectModel;
    this.searchModel['orderNo']=null ;
    this.searchModel['userPhone'] =null ;
    this.searchModel['userName']=null ;
    this.searchModel[name.toString()]=this.inputContent;
    this.getList();
  };

  // orderInfo : Object ;
  noteMark: boolean = false;

  orderDetail(orderId: number) {
    this.order.orderDetail(orderId)
      .pipe(
        filter((res: Response) => {
          if (res.success === false) {
            this.msg.fetchFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.orderInfo = res.data;

          this.noteMark = true;
        }
      );
  };

  orderInfo: Object;

  // getAllInfo(id: number) {
  //   forkJoin(
  //     [
  //       this.order.orderDetail(id),
  //       this.order.getRepaymentRecord({orderIds: id})
  //     ]
  //   )
  //     .pipe(
  //       filter(
  //         (res) => {
  //
  //           if (res[0]['success'] == false) {
  //             this.msg.operateFail(res[0]['message']);
  //           }
  //
  //           if (res[1]['success'] == false) {
  //             this.msg.operateFail(res[1]['message']);
  //           }
  //
  //           return res[0]['success'] == true && res[1]['success'] == true;
  //         }
  //       )
  //     )
  //     .subscribe(
  //       (res) => {
  //
  //         // this.orderDetail = res.data ;
  //
  //         let plan = res[1]['data'] ? res[1]['data'][0] : [];
  //
  //         this.orderInfo = {
  //           'order': res[0]['data'],
  //           'plan': plan
  //         };
  //
  //         this.noteMark = true;
  //       }
  //     );
  // };
  serialNumberChange(){
    let serialNumber=this.hasClearForm.get('serialNumber').value;
    if(serialNumber){
      let money=this.CxSerialNumber.filter(item=>{
        return item['serialNumber']==serialNumber;
      });
      this.hasClearForm.patchValue({
        "money": (money && money[0]['money']) ? money[0]['money'] : null,
        "manualRepaymentId":(money && money[0]['manualRepaymentId']) ? money[0]['manualRepaymentId'] : null,
      });
    }
  };
  export(){
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
    data.planRepaymentTimeStart = data.planRepaymentTimeStart ?  unixTime((<Date>data.planRepaymentTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.planRepaymentTimeEnd = data.planRepaymentTimeEnd ? unixTime((<Date>data.planRepaymentTimeEnd),"y-m-d") + " 23:59:59" : null;
    let startAudit=(new Date(data.planRepaymentTimeStart)).getTime();
    let endAudit=(new Date(data.planRepaymentTimeEnd)).getTime();
    if( startAudit - endAudit >0 ){
      data.planRepaymentTimeStart=null;
      data.planRepaymentTimeEnd=null;
    }
    this.service.exportData(data);
  }
}
