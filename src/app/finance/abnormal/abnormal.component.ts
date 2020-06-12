import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {Adaptor, ObjToArray} from '../../share/tool';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../share/table/table.model';
import {RepayListService} from '../../service/fincial';
import {Response} from '../../share/model';
import {CommonMsgService} from '../../service/msg';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {NumberValidator} from '../../share/validator';
import {Router} from '@angular/router';
import {dataFormat, DateObjToString, unixTime} from '../../format';
import {filter} from 'rxjs/operators';
import {OrderService} from '../../service/order';
import {forkJoin} from 'rxjs';
let __this;
@Component({
  selector: 'app-repay',
  templateUrl: './abnormal.component.html',
  styleUrls: ['./abnormal.component.less']
})
export class AbnormalComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: RepayListService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private router: Router,
    private order: OrderService
  ) {
  };

  ngOnInit() {
    __this = this;
    this.getLanguage();
  };

  searchModel: SearchModel = new SearchModel();

  private searchCondition: Object = {};
  serchEnum: Array<Object>;
  languagePack: object;
  abnormalType : Array<Object>;
  chType : Number=1;

  getLanguage() {
    this.translate.stream(['common', 'financeModule.abnormal'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            data: res['financeModule.abnormal'],
          };
          this.abnormalType=this.languagePack["data"]["abnormalType"];
          this.serchEnum=this.languagePack["data"]["type"];
          this.initTable();
        }
      );
  };
  selectModel:String="creditOrderNo";
  inputContent:String="";
  statusEnum: Array<Object>;
  status: string;

  getEnum(data: Array<Object>) {
    this.statusEnum = data;
  };

  reapyEnum: Array<{ name: string, value: number }>;

  tableData: TableData;

  totalSize: number = 0;
  remark: Object;
  initTable() {
    if(this.chType==1){
      this.tableData = {
        showIndex: true,
        loading: false,
        tableTitle: [
          {
            name: this.languagePack['data']['tabData']['serialNumber'],
            reflect: 'creditOrderNo',
            type: 'text'
          },
          {
            name: this.languagePack['data']['tabData']['createTime'],
            reflect: 'orderNo',
            type: 'text'
          },{
            name: this.languagePack['data']['tabData']['tradingPartners'],
            reflect: 'loanType',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['loanMethod'],
            reflect: 'userPhone',
            type: 'text',
          }, {
            name: this.languagePack['data']['tabData']['loanAmount'],
            reflect: 'userName',
            type: 'text',
          }, {
            name: this.languagePack['data']['tabData']['orderStatus'],
            reflect: 'totalPeriod',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['tradingAmount'],
            reflect: 'currentRepay',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['tradingStatus'],
            reflect: 'financingMoney',
            type: 'text'
          },{
            name: this.languagePack['repayList']['tabData']['remarks'],
            reflect: 'lendRateMoney',
            type: 'text',
          }
        ],
      };
    }else{
      this.tableData = {
        showIndex: true,
        loading: false,
        tableTitle: [
          {
            name: this.languagePack['data']['tabData']['serialNumber'],
            reflect: 'creditOrderNo',
            type: 'text'
          },
          {
            name: this.languagePack['data']['tabData']['createTime'],
            reflect: 'orderNo',
            type: 'text'
          },{
            name: this.languagePack['data']['tabData']['tradingPartners'],
            reflect: 'loanType',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['loanMethod'],
            reflect: 'userPhone',
            type: 'text',
          }, {
            name: this.languagePack['data']['tabData']['loanAmount'],
            reflect: 'userName',
            type: 'text',
          }, {
            name: this.languagePack['data']['tabData']['orderStatus'],
            reflect: 'totalPeriod',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['tradingAmount'],
            reflect: 'currentRepay',
            type: 'text'
          }, {
            name: this.languagePack['data']['tabData']['tradingStatus'],
            reflect: 'financingMoney',
            type: 'text'
          }
        ],
      };
    }
    this.getList();
  }
  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;
    if(data.minPlanRepaymentDate){
      data.minPlanRepaymentDate = DateObjToString((<Date>data.minPlanRepaymentDate));
    }
    if(data.maxPlanRepaymentDate){
      data.maxPlanRepaymentDate = DateObjToString((<Date>data.maxPlanRepaymentDate));
    }

    this.searchCondition['status']=false;
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
  changeStatus(status: Number){
    this.chType=status;
    this.initTable()
  }
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="orderNo";
    this.inputContent=null;
    this.getList();
  };
  export(){

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
    this.searchModel.currentPage = 1;
    let name=this.selectModel;
    this.searchModel['creditOrderNo']=null;
    this.searchModel['orderNo']=null ;
    this.searchModel['userPhone'] =null ;
    this.searchModel['userName']=null ;
    this.searchModel[name.toString()]=this.inputContent;
    this.getList();
  };
}
