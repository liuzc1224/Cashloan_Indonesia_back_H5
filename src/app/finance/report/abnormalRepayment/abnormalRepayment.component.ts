import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../../share/table/table.model';
import {abnormalRepaymentService} from '../../../service/fincial';
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
  selector: 'abnormalRepayment',
  templateUrl: './abnormalRepayment.component.html',
  styleUrls: ['./abnormalRepayment.component.less']
})
export class abnormalRepaymentComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: abnormalRepaymentService,
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
  selectModel:string="orderNo";
  inputContent:string="";
  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  getLanguage() {
    this.translate.stream(['common', 'finance.report.abnormalRepayment'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            data: res['finance.report.abnormalRepayment'],
            table: res['finance.report.abnormalRepayment']['table']
          };
          this.searchEnum=this.languagePack['data']['search'];
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
          name: __this.languagePack['table']['createTime'],
          reflect: 'createTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['transactionNumber'],
          reflect: 'merchantOrderId',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['orderNo'],
          reflect: 'orderNo',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['periods'],
          reflect: 'currentPeriod',
          type: 'text',
          filter : (item) => {
            return item.currentPeriod+"/"+(item.totalPeriod==null ? 1 : item.totalPeriod);
          }
        },
        {
          name: __this.languagePack['table']['paymentTypes'],
          reflect: 'paymentMethod',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['repaymentCode'],
          reflect: 'vaNumber',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['transactionAmount'],
          reflect: 'amount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['transactionTime'],
          reflect: 'dealTimeStr',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['phoneNumber'],
          reflect: 'tel',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['createor'],
          reflect: 'creator',
          type: 'text',
          filter : (item) => {
            return item.creator==null ? __this.languagePack['table']['createorifnull'] : item.creator
          }
        },
        {
          name: __this.languagePack['table']['state'],
          reflect: 'status',
          type: 'text',
          filter : (item) => {
            let status=item['status'];
            if(status!==null){
              let type=__this.languagePack.data.status.filter(v => {
                return v.value===status
              });
              status=(type && type[0].desc) ? type[0].desc : "";
            }
            return (status) ? status : "";
          }
        }
      ] ,
      btnGroup: {
        title: __this.languagePack['table']['operate'],
        data: [{
          textColor: '#0000ff',
          name: __this.languagePack['table']['refresh'],
          bindFn: (item) => {
            //实现单行刷新功能
            this.service.getAbnormalRepayment({"id":item.id})
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

  changeSelect(){
    this.inputContent="";

    this.searchModel.orderNo=null;
    this.searchModel.merchantOrderId=null;
    this.searchModel.account=null;
    this.searchModel.vaNumber=null;

    this.searchModel[this.selectModel]=this.inputContent;
  };

  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;

    this.searchModel[this.selectModel]=this.inputContent;

    if(this.searchModel.createTimeStart!==null){
      this.searchModel.createTimeStart=unixTime(this.searchModel.createTimeStart, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.createTimeEnd!==null){
      this.searchModel.createTimeEnd=unixTime(this.searchModel.createTimeEnd, 'y-m-d')+" 23:59:59";
    }
    if(this.searchModel.dealTimeStart!==null){
      this.searchModel.dealTimeStart=unixTime(this.searchModel.dealTimeStart, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.dealTimeEnd!==null){
      this.searchModel.dealTimeEnd=unixTime(this.searchModel.dealTimeEnd, 'y-m-d')+" 23:59:59";
    }

    this.service.getAbnormalRepayment(data)
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
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent="";
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
    this.getList();
  };

  downabnormalRepaymentList(){
    this.searchModel[this.selectModel]=this.inputContent;

    if(this.searchModel.createTimeStart!==null){
      this.searchModel.createTimeStart=unixTime(this.searchModel.createTimeStart, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.createTimeEnd!==null){
      this.searchModel.createTimeEnd=unixTime(this.searchModel.createTimeEnd, 'y-m-d')+" 23:59:59";
    }
    if(this.searchModel.dealTimeStart!==null){
      this.searchModel.dealTimeStart=unixTime(this.searchModel.dealTimeStart, 'y-m-d')+" 00:00:00";
    }
    if(this.searchModel.dealTimeEnd!==null){
      this.searchModel.dealTimeEnd=unixTime(this.searchModel.dealTimeEnd, 'y-m-d')+" 23:59:59";
    }

    this.service.downabnormalRepaymentList(this.searchModel);

  };

}
