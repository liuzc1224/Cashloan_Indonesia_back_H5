import {Component, OnInit} from '@angular/core';
import {SearchModel} from './searchModel';
import {TranslateService} from '@ngx-translate/core';
import {TableData} from '../../../share/table/table.model';
import {accountMonitoringService} from '../../../service/fincial';
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
  selector: 'account-monitoring',
  templateUrl: './accountMonitoring.component.html',
  styleUrls: ['./accountMonitoring.component.less']
})
export class AccountMonitoringComponent implements OnInit {
  constructor(
    private translate: TranslateService,
    private service: accountMonitoringService,
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
  serchEnum: Array<Object>;
  languagePack: object;
  operType:Array<Object>;
  hasClearForm: FormGroup;
  selectModel:string="platformName";
  inputContent:String="";
  statusEnum: Array<Object>;
  searchEnum: Array<Object>;
  maxValue:Number=0;
  hasClearMark:boolean=false;
  status: string;
  reapyEnum: Array<{ name: string, value: number }>;
  CxSerialNumber : Array<Object>;

  tableData: TableData;

  totalSize: number = 0;
  remark: Object;
  readonly :String="readonly";

  ngOnInit() {
    __this = this;
    this.getLanguage();

    this.hasClearForm = this.fb.group({
      'id' : [null, [Validators.required]],
      'platformName' : [null, [Validators.required]],
      'effectiveBalanceLimit' : [null, [Validators.required]],
      'emailq' : [null, [Validators.required]],
      'emailh' : [null, [Validators.required]],
      'email' : [null],
      'paymentFlag' : [null, [Validators.required]]
    });

  };

  getLanguage() {
    this.translate.stream(['common', 'finance.report.accountMonitoring'])
      .subscribe(
        res => {
          this.languagePack = {
            common: res['common'],
            data: res['finance.report.accountMonitoring'],
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
          name: this.languagePack['data']['paymentPlatform'],
          reflect: 'platformName',
          type: 'text'
        },
        {
          name: this.languagePack['data']['accountBalance'],
          reflect: 'balance',
          type: 'text'
        },
        {
          name: this.languagePack['data']['withdrawableBalance'],
          reflect: 'effectiveBalance',
          type: 'text'
        },
        {
          name: this.languagePack['data']['balanceLimitTB'],
          reflect: 'effectiveBalanceLimit',
          type: 'text',
        },
        {
          name: this.languagePack['data']['notification'],
          reflect: 'email',
          type: 'text',
        },
        {
          name: this.languagePack['data']['st'],
          reflect: 'status',
          type: 'text',
          filter : (item) => {
            let state = item['status'] ;
            const map = __this.languagePack['data']['status'] ;
            let name = map.filter( item => {
              return item.value == state ;
            });
            return (name.length>0 && name[0].desc ) ? name[0].desc : "" ;
          }
        }
      ],
      btnGroup: {
        title: this.languagePack['common']['operate']['name'],
        data: [
          {
            name: this.languagePack['common']['operate']['edit'],
            textColor: '#80accf',
            bindFn: (item) => {
              this.hasClearMark=true;
              this.hasClearForm.patchValue({
                'id' : item.id,
                'platformName' : item.platformName,
                'effectiveBalanceLimit' : item.effectiveBalanceLimit,
                'emailq' :item.email.split('@')[0],
                'emailh' :"@"+item.email.split('@')[1],
                'email' :this.hasClearForm.value.emailq+this.hasClearForm.value.emailh,
                'paymentFlag' :item.paymentFlag
              })
            }
          }
        ]
      }
    };
    this.getList();
  }

  changeSelect(){
    this.searchModel.platformName=null;
    this.searchModel[this.selectModel]=this.inputContent;
  };

  getList() {
    this.tableData.loading = true;
    let data = this.searchModel;

    this.searchModel[this.selectModel]=this.inputContent;
    
    // this.searchCondition['status']=false;

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

  submit($event){
    this.hasClearForm.patchValue({
      "email":this.hasClearForm.value.emailq+this.hasClearForm.value.emailh
    });
    // this.isOkLoading = true;
    let valid = this.hasClearForm.valid;
    if (!valid) {
      // this.isOkLoading = false;
      this.Cmsg.error(this.languagePack['common']['tips']['notEmpty']);
      return;
    }
    let postData = this.hasClearForm.value;
    this.service.update(postData)
    .pipe(
      filter( (res : Response) => {
        // this.isOkLoading = false ;
        if(res.success === false){
          this.msg.fetchFail(res.message) ;
        }
        return res.success === true;
      })
    )
    .subscribe(
      ( res : Response ) => {
        // this.isVisible = false;
        this.hasClearMark = false;
        this.getList();
      }
    );
  };
  
  cancel(){
    this.hasClearMark = false;
    this.hasClearForm.reset();
  }
  reset() {
    this.searchModel = new SearchModel();
    this.selectModel="platformName";
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

  downloadAccountMonitoring(){
    this.searchModel[this.selectModel]=this.inputContent;


    this.service.downloadAccountMonitoring(this.searchModel);

  };

}
