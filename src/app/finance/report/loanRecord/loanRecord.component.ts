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
let __this;
@Component({
  selector: 'loan-record',
  templateUrl: './loanRecord.component.html',
  styleUrls: ['./loanRecord.component.less']
})
export class LoanRecordComponent implements OnInit {
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
  searchEnum: Array<Object>;
  languagePack: object;
  tableData: TableData;
  totalSize: number = 0;
  inputContent:string="";
  status:any=null;
  paymentChannels:any=null;
  selectWhat:string="orderNo";
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  getLanguage() {
    this.translate.stream(['common', 'finance.report.loanRecord'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            data: res['finance.report.loanRecord']
          };
          this.searchEnum=this.languagePack['data']['search'];
          this.status=this.languagePack['data']['statuss'];
          this.paymentChannels=this.languagePack['data']['paymentChannels'];
          this.initTable();
        }
      );
  };
  initTable() {
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['data']['createTime'],
          reflect: 'createTime',
          type: 'text'
        },
        {
          name: this.languagePack['data']['paymentChannel'],
          reflect: 'paymentChannelStr',
          type: 'text',
          // filter:(item)=>{
          //   let status=item['operator'];
          //   if(status!==null){
          //     let type=__this.paymentChannels.filter(v => {
          //       return v.value===status
          //     });
          //     status=(type && type[0].desc) ? type[0].desc : "";
          //   }
          //   return (status) ? status : "";
          // }
        },
        {
          name: this.languagePack['data']['transactionNumber'],
          reflect: 'serialNumber',
          type: 'text'
        },
        {
          name: this.languagePack['data']['orderNo'],
          reflect: 'orderNo',
          type: 'text',
        },
        {
          name: this.languagePack['data']['transactionAmount'],
          reflect: 'payMoney',
          type: 'text',
        },
        {
          name: this.languagePack['data']['bankName'],
          reflect: 'bankName',
          type: 'text',
        },
        {
          name: this.languagePack['data']['bankCard'],
          reflect: 'card',
          type: 'text'
        }, 
        {
          name: this.languagePack['data']['cardholder'],
          reflect: 'userName',
          type: 'text'
        },{
          name: this.languagePack['data']['phoneNumber'],
          reflect: 'tel',
          type: 'text',
        },{
          name: this.languagePack['data']['state'],
          reflect: 'paymentResult',
          type: 'text',
          filter:(item) =>{
            let status=item['paymentResult'];
            if(status!==null){
              let type=__this.status.filter(v => {
                return v.value===status
              });
              status=(type && type[0].desc) ? type[0].desc : "";
            }
            return (status) ? status : "";
          }
        },
        {
          name: this.languagePack['data']['successTime'],
          reflect: 'payDate',
          type: 'text',
          filter:(item) =>{
            if(item['paymentResult']==2){
              return item['payDate']
            }else{
              return ''
            }
          }
        }
      ] ,
      // btnGroup: {
      //   title: __this.languagePack['data']['operate'],
      //   data: [{
      //     textColor: '#0000ff',
      //     name: __this.languagePack['data']['refresh'],
      //     bindFn: (item) => {
      //       //实现单行刷新功能
      //       // console.log(item.serialNumber)
      //       this.service.getTbale({"serialNumber":item.serialNumber})
      //       .subscribe(
      //         (res: Response) => {
      //             this.tableData.data.filter((value,key)=>{
      //               // console.log(value['serialNumber'],res.data[0].serialNumber,key)
      //               if(value['serialNumber']==res.data[0].serialNumber){
      //                 this.tableData.data.splice(key,1,res.data[0]);
      //                 this.msg.operateTrue(__this.languagePack['data']['realyRefresh']);
      //               }
      //             });
      //
      //         }
      //       );
      //     }
      //   }]
      // }
    };
    this.getList();
  }

  getList() {
    this.tableData.loading = true;
    // console.log(this.selectWhat);
    this.searchModel[this.selectWhat]=this.inputContent;

    if(this.searchModel.startTime!==null){
      this.searchModel.startTime=unixTime(this.searchModel.startTime, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.endTime!==null){
      this.searchModel.endTime=unixTime(this.searchModel.endTime, 'y-m-d')+" 23:59:59";
    }
    if(this.searchModel.payMinDate!==null){
      this.searchModel.payMinDate=unixTime(this.searchModel.payMinDate, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.payMaxDate!==null){
      this.searchModel.payMaxDate=unixTime(this.searchModel.payMaxDate, 'y-m-d')+" 23:59:59";
    }
    let data = this.searchModel;
    this.service.getTbale(data)
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
          // console.log(res);
          this.tableData.data = (<Array<Object>>data_arr);
          if (res.page && res.page.totalNumber)
            this.totalSize = res.page.totalNumber;
          else
            this.totalSize = 0;
        }
      );
  };
  reset() {
    this.selectWhat="orderNo";
    this.searchModel = new SearchModel();
    this.inputContent="";
    this.getList();
  };

  changeSelect() {
    this.searchModel.orderNo=null;
    this.searchModel.serialNumber=null;
    this.searchModel.account=null;
    this.searchModel.userName=null;
    this.searchModel.card=null;
    this.searchModel[this.selectWhat]=this.inputContent;
  }

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
    this.getList();
  };
  downloandLoanTable(){
    this.searchModel[this.selectWhat]=this.inputContent;

    if(this.searchModel.startTime!==null){
      this.searchModel.startTime=unixTime(this.searchModel.startTime, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.endTime!==null){
      this.searchModel.endTime=unixTime(this.searchModel.endTime, 'y-m-d')+" 23:59:59";
    }
    if(this.searchModel.payMinDate!==null){
      this.searchModel.payMinDate=unixTime(this.searchModel.payMinDate, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.payMaxDate!==null){
      this.searchModel.payMaxDate=unixTime(this.searchModel.payMaxDate, 'y-m-d')+" 23:59:59";
    }

    this.service.downloandLoanTable(this.searchModel);

  };
}
