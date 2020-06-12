import {Component, OnInit} from '@angular/core';
import {dataFormat, DateObjToString, unixTime} from '../../../format';
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {CommonMsgService} from '../../../service/msg/commonMsg.service';
import {Response} from '../../../share/model/reponse.model';
import {filter} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {channelDataService} from '../../../service/report';

let __this;

@Component({
  selector: 'financial-data',
  templateUrl: './financialData.component.html',
  styleUrls: ['./financialData.component.less']
})
export class FinancialDataComponent implements OnInit {

  constructor(
    private msg: CommonMsgService,
    private translateSer: TranslateService,
    private service : channelDataService ,
  ) {
  };

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  financeCurrent: Object;
  ngOnInit() {
    __this = this;
    this.getLanguage();
    this.getFinanceCurrent();
  };

  // totalSize: number = 0;
  tableData: TableData;

  getLanguage() {
    this.translateSer.stream(['reportModule.financialdata', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            data: data['reportModule.financialdata'],
          };
          this.initTable();
        }
      );
  }
  initTable(){
    this.tableData = {
      showIndex: true,
      loading: false,
      tableTitle: [
        {
          name: this.languagePack['data']['tableData']['month'],
          reflect: 'date',
          type: 'text'
        },
        {
          name: this.languagePack['data']['tableData']['applyAmount'],
          reflect: 'applyAmount',
          type: 'text',
          filter : ( item ) => {
            return item['applyAmount']==null? 0 :item['applyAmount'] ;
          }
        },{
          name: this.languagePack['data']['tableData']['applyNum'],
          reflect: 'applyNum',
          type: 'text',
          filter : ( item ) => {
            return item['applyNum']==null? 0 :item['applyNum'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['loanAmount'],
          reflect: 'loanAmount',
          type: 'text',
          filter : ( item ) => {
            return item['loanAmount']==null? 0 :item['loanAmount'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['loanNum'],
          reflect: 'loanNum',
          type: 'text',
          filter : ( item ) => {
            return item['loanNum']==null? 0 :item['loanNum'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['oughtRepayAmount'],
          reflect: 'oughtRepayAmount',
          type: 'text',
          filter : ( item ) => {
            return item['oughtRepayAmount']==null? 0 :item['oughtRepayAmount'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['realOughtRepayAmount'],
          reflect: 'realOughtRepayAmount',
          type: 'text',
          filter : ( item ) => {
            return item['realOughtRepayAmount']==null? 0 :item['realOughtRepayAmount'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['doneNum'],
          reflect: 'doneNum',
          type: 'text',
          filter : ( item ) => {
            return item['doneNum']==null? 0 :item['doneNum'] ;
          }
        }, {
          name: this.languagePack['data']['tableData']['repayAmount'],
          reflect: 'repayAmount',
          type: 'text',
          filter : ( item ) => {
            return item['repayAmount']==null? 0 :item['repayAmount'] ;
          }
        }
      ]
    };
    this.getList();
  }
  reset() {
    this.searchModel = new SearchModel;
    this.getList();
  };
  search() {
    this.searchModel.currentPage = 1 ;
    this.getList();
  };
  getFinanceCurrent(){
    this.service.getFinanceCurrent()
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
          this.financeCurrent = (< Array<Object> >res.data);
          // console.log(res);
          // if(res.page){
          //   this.totalSize = res.page["totalNumber"] ;
          // }
        }
      );
  }
  getList() {
    this.tableData.loading = true ;
    console.log(this.searchModel.start,this.searchModel.end)
    if(this.searchModel.start!==null&&typeof(this.searchModel.start)!=="string"){
      this.searchModel.start=unixTime(this.searchModel.start, 'y-m')+"-01 00:00:00";
    }
    if(this.searchModel.end!==null&&typeof(this.searchModel.end)!=="string"){
      this.searchModel.end=unixTime(this.searchModel.end, 'y-m')+"-"+new Date(this.searchModel.end.getFullYear(),this.searchModel.end.getMonth()+1,0).getDate()+" 23:59:59";
    }
    let data = this.searchModel;
    // console.log(this.searchModel.start,this.searchModel.end)
    // if(data.start&&DateObjToString((<Date>data.start)).indexOf(" 00:00:00")== -1){
    //   data.start = DateObjToString((<Date>data.start))+" 00:00:00";
    // }
    // if(data.end&&DateObjToString((<Date>data.end)).indexOf(" 23:59:59")== -1){
    //   data.end = DateObjToString((<Date>data.end))+" 23:59:59";
    // }

    this.service.getFinanceHistory(data)
      .pipe(
        filter( (res : Response) => {
          this.tableData.loading=false;
          if(res.success === false){
            this.msg.fetchFail(res.message) ;
          };
          return res.success === true;
        })
      )
      .subscribe(
        ( res : Response ) => {
          this.tableData.data = (< Array<Object> >res.data);
          // console.log(res);
          if(res.page){
            // this.totalSize = res.page["totalNumber"] ;
          }
        }
      );
  }
  // pageChange($size : number , type : string) : void{
  //   if(type == 'size'){
  //     this.searchModel.pageSize = $size ;
  //   };
  //   if(type == 'page'){
  //     this.searchModel.currentPage = $size ;
  //   };
  //   this.getList() ;
  // };
}
