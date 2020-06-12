import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../../share/table/table.model';
import {abnormalLendingService} from '../../../service/fincial';
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
  selector: 'abnormalLending',
  templateUrl: './abnormalLending.component.html',
  styleUrls: ['./abnormalLending.component.less']
})
export class abnormalLendingComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: abnormalLendingService,
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
  bankReturnStatus:any=null;
  selectWhat:string="orderNo";
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  getLanguage() {
    this.translate.stream(['common', 'finance.report.abnormalLending'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            data: res['finance.report.abnormalLending'],
            table: res['finance.report.abnormalLending']['table']
          };
          this.searchEnum=this.languagePack['data']['search'];
          this.status=this.languagePack['data']['status'];
          this.paymentChannels=this.languagePack['data']['paymentChannels'];
          this.bankReturnStatus=this.languagePack['data']['bankReturnStatus'];
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
          name: this.languagePack['table']['detectionTime'],
          reflect: 'createTime',
          type: 'text'
        },
        {
          name: this.languagePack['table']['createTime'],
          reflect: 'paymentCreateTime',
          type: 'text'
        },
        {
          name: this.languagePack['table']['paymentChannel'],
          reflect: 'platformId',
          type: 'text',
          filter : (item)=>{
            let status=item['platformId'];
            if(status!==null){
              let type=__this.paymentChannels.filter(v => {
                return v.value===status
              });
              status=(type && type[0].desc) ? type[0].desc : "";
            }
            return (status) ? status : "";
          }
        },
        {
          name: this.languagePack['table']['transactionNumber'],
          reflect: 'disburseId',
          type: 'text',
        },
        {
          name: this.languagePack['table']['orderNo'],
          reflect: 'orderId',
          type: 'text',
        },
        {
          name: this.languagePack['table']['transactionAmount'],
          reflect: 'amountTransfer',
          type: 'text',
        },
        {
          name: this.languagePack['table']['bankName'],
          reflect: 'bankName',
          type: 'text'
        }, 
        {
          name: this.languagePack['table']['bankCard'],
          reflect: 'bankAccount',
          type: 'text'
        },{
          name: this.languagePack['table']['cardholder'],
          reflect: 'senderName',
          type: 'text',
        },{
          name: this.languagePack['table']['phoneNumber'],
          reflect: 'userPhone',
          type: 'text',
        },
        {
          name: this.languagePack['table']['state'],
          reflect: 'responseCode',
          type: 'text',
          filter:(item) =>{
            let status=item['responseCode'];
            //不是“成功00”就是“失败”
            if(status!=="00"){
              status="999"
            }
            if(status!==null){
              let type=__this.bankReturnStatus.filter(v => {
                return v.value===status
              });
              status=(type && type[0].desc) ? type[0].desc : "";
            }
            return (status) ? status : "";
          }
        },
        {
          name: this.languagePack['table']['falseReason'],
          reflect: 'remark',
          type: 'text',
        },
        {
          name: this.languagePack['table']['successTime'],
          reflect: 'payDate',
          type: 'text',
        }
      ] ,
      btnGroup: {
        title: __this.languagePack['table']['operate'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['table']['refresh'],
          bindFn: (item) => {
            //实现单行刷新功能
            this.service.getAbnormalLending({"id":item.id})
            .subscribe(
              (res: Response) => {
                  this.tableData.data.filter((value,key)=>{
                    if(value['id']==res.data[0].id){
                      this.tableData.data.splice(key,1,res.data[0]);
                      this.msg.operateTrue(__this.languagePack['data']['realyRefresh']);
                    }
                  });

              }
            );
          }
        }]
      }
    };
    this.getList();
  }

  getList() {
    this.tableData.loading = true;
    // console.log(this.selectWhat);
    this.searchModel[this.selectWhat]=this.inputContent;

    if(this.searchModel. createTimeStart!==null){
      this.searchModel. createTimeStart=unixTime(this.searchModel. createTimeStart, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.createTimeEnd!==null){
      this.searchModel.createTimeEnd=unixTime(this.searchModel.createTimeEnd, 'y-m-d')+" 23:59:59";
    }
    let data = this.searchModel;
    this.service.getAbnormalLending(data)
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
    this.searchModel.disburseId=null;
    this.searchModel.accountName=null;
    this.searchModel.senderName=null;
    this.searchModel.bankAccount=null;
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
}
