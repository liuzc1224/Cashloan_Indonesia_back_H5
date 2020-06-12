import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import { unixTime} from '../../../format';

import {LoanListService} from '../../../service/fincial';
import {RepayListService} from '../../../service/fincial';
import {OrderService} from '../../../service/order';
import {CommonMsgService} from '../../../service/msg/commonMsg.service';
import {Response} from '../../../share/model/reponse.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {SessionStorageService} from '../../../service/storage';
import {Router} from '@angular/router';
import {GetNow, DateToStamp} from '../../../share/tool';
import {ObjToQueryString} from "../../../service/ObjToQueryString";

let __this;

@Component({
  selector: '',
  templateUrl: './loanList.component.html',
  styleUrls: ['./loanList.component.less']
})
export class LoanListComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private service: LoanListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private sgo: SessionStorageService,
    private router: Router,
    private order: OrderService,
    private Repayservice: RepayListService
  ) {
  };

  ngOnInit() {
    __this = this;

    this.getLanguage();

    this.validateForm = this.fb.group({
      'orderId':[null],
      'balanceApplyId':[null],
      'paymentResult': [ null ],
      'paymentChannel':[null],
      'ourAccount': [null],
      'serialNumber': [null],
      'payDate': [null],
      'payMoney': [null],
      'option': [null],

    });
    this.validateReviewForm = this.fb.group({
      'orderId':[null],
      'userId':[null],
      'type': [null, [Validators.required]],
      'option': [null ]

    });
  };

  languagePack: Object;
  state:number=1;
  statusEnum: Array<Object>;
  tradingStatus: Array<Object>;
  paymentChannel: Array<Object>;
  searchEnum: Array<Object>;
  validateForm: FormGroup;
  validateReviewForm: FormGroup;
  hidden:Boolean=false;
  loadingReview:Boolean=false;
  loadingLoan:Boolean=false;
  inputData:Array<Object>;
  paymentStatus:Array<Object>;
  stateModificationData:Array<Object>;
  getLanguage() {
    this.translateSer.stream(['financeModule.list', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['financeModule.list']

          };
          this.inputData=this.languagePack['list']['ordertypeList'];
          this.paymentStatus=this.languagePack['list']['state'];
          this.statusEnum = this.languagePack['list']['status1'];
          this.tradingStatus = this.languagePack['list']['paymentResult'];
          this.paymentChannel = this.languagePack['list']['paymentChannel'];
          this.searchEnum = this.languagePack['list']['search'];
          this.stateModificationData = this.languagePack['list']['model']['state'];

          this.initialLoanTable();
        }
      );
  };

  searchModel: SearchModel = new SearchModel();
  private searchCondition: Object = {};

  changeStatus(status: number) {
    if(status==3){
      this.searchModel.status = status;
      this.state = status;
    }else{
      this.searchModel.status = null;
      this.state = 1;
    }
    this.searchModel.currentPage = 1;
    this.initialLoanTable();
  };

  tableData: TableData;

  initialLoanTable() {
    this.tableData = {
      tableTitle: [
        {
          name: __this.languagePack['list']['detail']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['createTime'],
          reflect: 'createTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['userNo'],
          reflect: 'phoneNumber',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['userName'],
          reflect: 'userName',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['type'],
          reflect: 'productType',
          type: 'text',
          filter:(item) =>{
            let loanType=item['productType'];
            if(item['productType']!=null){
              let type=__this.inputData.filter(v => {
                return v.value==item['productType']
              });
              loanType=(type && type[0].desc) ? type[0].desc : "";
            }
            return (loanType) ? loanType : "";
          }
        },
        {
          name: __this.languagePack['list']['reviewDate'],
          reflect: 'auditPassTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['loanMoney'],
          reflect: 'applyCash',
          type: 'text',
          filter : (item)=>{
            let applyCash = item['applyCash'];
            // if(item['loanType']==2){
            //   financingMoney=financingMoney-item['otherCost']
            // }
            return (applyCash) ? (applyCash).toFixed(2): "";
          }
        },
        {
          name: __this.languagePack['list']['detail']['limit'],
          reflect: 'loanDays',
          type: 'text',
          // filter:(item) =>{
          //   let loanDays=item['loanDays'];
          //   let time="";
          //   if(item['loanType']!=null){
          //     let type=__this.inputData.filter(v => {
          //       return v.value==item['loanType']
          //     });
          //     time=(type && type[0].time) ? type[0].time : "";
          //   }
          //   return (loanDays) ? loanDays+time : "";
          // }
        },
        {
          name: __this.languagePack['list']['detail']['loanAmount'],
          reflect: 'payMoney',
          type: 'text',
          filter : (item)=>{
            let payMoney = item['payMoney'];
            // if(item['loanType']==2){
            //   financingMoney=financingMoney-item['otherCost']
            // }
            return (payMoney) ? (payMoney).toFixed(2): "";
          }
        },
        {
          name: __this.languagePack['list']['detail']['operateResult'],
          reflect: 'operation',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['operateTime'],
          reflect: 'payDate',
          type: 'text'
        },
        {
          name: __this.languagePack['list']['detail']['operateName'],
          reflect: 'operatorName',
          type: 'text',
          // filter: (item) => {
          //   const operator = item['operator'];
          //   if(operator!=null){
          //     const map = __this.languagePack['list']['operator'];
          //     let name = map.filter(item => {
          //       return item.value == operator;
          //     });
          //     return (name && name[0].desc) ? name[0].desc : "no";
          //   }
          // }
        },
        {
          name: __this.languagePack['list']['detail']['orderStatus'],
          reflect: 'status',
          type: 'mark',
          markColor: { '1': "#ec971f", '2': "#87d068", '3': "#d9534f", '4': "#87d068" },
          filter: (item) => {
            const status = item['status'];
            if(status!=null){
              const map = __this.languagePack['list']['state'];
              let name = map.filter(item => {
                return item.value == status;
              });
              return (name && name[0].desc) ? name[0].desc : "no";
            }
          }
        }
      ],
      loading: false,
      showIndex: true,
      btnGroup: {
        title: __this.languagePack['common']['operate']['name'],
        data: [
          {
            textColor: '#6f859c',
            name: __this.languagePack['common']['btnGroup']['f'],
            // ico: 'anticon anticon-file',
            showContion: {
              name: 'status',
              value: [3]
            },
            bindFn: (item) => {
              this.reviewMark = true;
              this.validateReviewForm.reset();
              this.validateReviewForm.patchValue({
                orderId:item['orderId'],
                userId: item['userId'],
                option: item.option,
                type:null,
              });
            }
          },
          {
            textColor: '#80accf',
            name: __this.languagePack['list']['makeLoan'],
            // ico: 'anticon anticon-pay-circle-o',
            // showContion: {
            //   name: 'status',
            //   value: [13]
            // },
            bindFn: (item) => {
              this.selectItem = item;
              this.makeLoanMark = true;
              this.validateForm.reset();
              let payMoney = item['payMoney'];
              // if(item['loanType']==2){
              //   payMoney=payMoney-item['otherCost']
              // }
              this.validateForm.patchValue({
                orderId:item['orderId'],
                payMoney: payMoney,
                balanceApplyId: item.id,
                paymentResult:1
              });
            }
          },
          {
            textColor: '#80accf',
            name: __this.languagePack['common']['btnGroup']['a'],
            // ico: 'anticon anticon-file',
            // showContion: {
            //   name: 'status',
            //   value: [1, 2, 3, 4, 5, 6]
            // },
            bindFn: (item) => {
              let paramData={
                order: item['orderId'],
                userId: item['userId'],
              };
              let para = ObjToQueryString(paramData);
              window.open(`${window.location.origin+window.location.pathname}#/order/detail?${para}`,"_blank");
              // this.router.navigate(['/order/detail'], {
              //   queryParams: {
              //     order: item['orderId'],
              //     userId: item['userId'],
              //   }
              // });
            }
          }
        ]
      }
    };
    this.getList();
  };

  selectModel:String="orderNo";
  inputContent:String="";

  selectItem: object;

  totalSize: number = 0;

  makeLoanMark: boolean;
  reviewMark: boolean;

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

    data.auditTimeStart = data.auditTimeStart ?  unixTime((<Date>data.auditTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.auditTimeEnd = data.auditTimeEnd ? unixTime((<Date>data.auditTimeEnd),"y-m-d") + " 23:59:59" : null;
    let startAudit=(new Date(data.auditTimeStart)).getTime();
    let endAudit=(new Date(data.auditTimeEnd)).getTime();
    if( startAudit - endAudit >0 ){
      data.auditTimeStart=null;
      data.auditTimeEnd=null;
    }


    // this.searchCondition['status']=false;
    // let sort = ObjToArray(this.searchCondition);
    // data.columns = sort.keys;
    // data.orderBy = sort.vals;
    this.service.loanList(data)
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

  pageChange($size: number, type: string): void {
    if (type == 'size') {
      this.searchModel.pageSize = $size;
    }
    if (type == 'page') {
      this.searchModel.currentPage = $size;
    }
    this.getList();
  };

  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
  };

  change() {
    let result=this.validateForm.get('paymentResult').value;
    (result==1) ? this.hidden=false :this.hidden=true;
  }

  makeNew($event) {
    let data = this.validateForm.value;
    if(this.hidden){
      data['payMoney']=null;
      if (!data.option) {
        let msg = this.languagePack['common']['tips']['notEmpty'];

        this.msg.operateFail(msg);
        return;
      }
      this.makeLoan(data);
    }else{
      const chooseTime = DateToStamp(data.payDate);
      const newTime = GetNow(true);
      if (chooseTime > newTime) {
        this.msg.operateFail(this.languagePack['common']['tips']['diffTime']);
        return false;
      }
      data.payDate=DateToStamp(data.payDate);
      if (!data.payDate || !data.payMoney) {
        let msg = this.languagePack['common']['tips']['notEmpty'];

        this.msg.operateFail(msg);
        return;
      }
      this.makeLoan(data);
    }
  };
  makeLoan(data){
    this.loadingLoan=true;
    this.service.makeLoan(data)
      .pipe(
        filter((res: Response) => {
          this.loadingLoan=false;
          if (res.success !== true) {
            this.msg.operateFail(res.message);
          }
          ;

          // el.disabled = false;

          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {

          this.msg.operateSuccess();

          this.getList();

          this.makeLoanMark = false;
        }
      );
  }
  search() {
    this.searchModel.currentPage = 1;
    this.searchModel['orderNo']=null ;
    this.searchModel['phoneNumber'] =null ;
    this.searchModel['userName']=null ;
    let name=this.selectModel;
    this.searchModel[name.toString()]=this.inputContent;
    this.getList();
  };
  reviewCancel(){
    this.reviewMark=false;
  }
  makeReview(){
    // 'userId':[null],
    //   'type': [null, [Validators.required]],
    //   'option': [null ]
    let value=this.validateReviewForm.value;
    let data={
      userId: value['userId'],
      type: value['type']
    };
    this.loadingReview=true;
    this.service.paymentReview(data)
      .pipe(
        filter((res: Response) => {
          this.loadingReview=false;
          if (res.success !== true) {
            this.msg.fetchFail(res.message);
          }
          return res.success === true;
        })
      )
      .subscribe(
        (res: Response) => {
          this.msg.operateSuccess();
          this.reviewMark=false;
          this.getList();
        }
      );
  }
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
    data.auditTimeStart = data.auditTimeStart ?  unixTime((<Date>data.auditTimeStart),"y-m-d")+ " 00:00:00" : null;
    data.auditTimeEnd = data.auditTimeEnd ? etime + " 23:59:59" : null;
    let startAudit=(new Date(data.auditTimeStart)).getTime();
    let endAudit=(new Date(data.auditTimeEnd)).getTime();
    if( startAudit - endAudit >0 ){
      data.auditTimeStart=null;
      data.auditTimeEnd=null;
    }
    this.service.exportLoanData(data);
  }
}
