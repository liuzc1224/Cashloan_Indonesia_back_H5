import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TableData } from "../../share/table/table.model";

import { UserListService } from "../../service/user";
import { CommonMsgService } from "../../service/msg/commonMsg.service";
import { Response } from "../../share/model/reponse.model";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { filter } from "rxjs/operators";
import { Router } from "@angular/router";
import { SessionStorageService } from "../../service/storage";
import { ActivatedRoute } from "@angular/router";
import { AuthComponent } from "../../share/auth/auth.component";
import { OrderService, UserService } from "../../service/order";

let __this=this;
@Component({
  selector: "",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.less"]
})
export class AccountComponent implements OnInit {
  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private fb: FormBuilder,
    private routerInfo: ActivatedRoute,
    private service: UserService,
    private sgo: SessionStorageService,
    private orderSer: OrderService,
    private router: Router
  ) {}
  languagePack: Object;
  tableData: TableData;
  status : Array<String>;
  para : any;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.routerInfo.queryParams
      .subscribe(
        (para) => {
          this.para = para;
          console.log(this.para);
          this.getLanguage();
        }
      );
  };

  getLanguage() {
    this.translateSer.stream(['collectionBusiness', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            list: data['collectionBusiness'],
            tabData:data['collectionBusiness']['tabData']
          };
          this.status=data['collectionBusiness']['state'];
          this.initialTable();
        }
      );
  };

  initialTable() {
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['tabData']['id'],
          reflect: 'id',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['name'],
          reflect: 'phaseName',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['fromTime'],
          reflect: 'startOverdueTime',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['toTime'],
          reflect: 'endOverdueTime',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['days'],
          reflect: 'retainedDays',
          type: 'text',
        },
        {
          name: __this.languagePack['tabData']['flowMode'],
          reflect: 'flowPattern',
          type: 'text',
          filter: (item) => {
            let data=__this.languagePack['list']['flowMode'];
            let type=data.filter(v => {
              return v.value===item['flowPattern'];
            });
            let flowMode=(type.length>0 && type[0].desc) ? type[0].desc : "";
            return (flowMode) ? flowMode : '';
          }
        },
        {
          name: __this.languagePack['tabData']['freeLoanTerm'],
          reflect: 'loanTermWithoutReminder',
          type: 'text'
        },
        {
          name: __this.languagePack['tabData']['state'],
          reflect: 'state ',
          type: 'text',
          filter: (item) => {
            let data=__this.status;
            let type=data.filter(v => {
              return v.value===item['state'];
            });
            let state=(type.length>0 && type[0].desc) ? type[0].desc : "";
            return (state) ? state : '';
          },
        }
      ]
    };
    this.getList();
  }

  totalSize: number = 0;

  getList(){
    this.tableData.loading = true ;
    this.service.getBankInfo(this.para.usrId)
      .pipe(
        filter( (res : Response) => {

          this.tableData.loading = false ;
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize = 0;
          }
        }
      );
  }
}
