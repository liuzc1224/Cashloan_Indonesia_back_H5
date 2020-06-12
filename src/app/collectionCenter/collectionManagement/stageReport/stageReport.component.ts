import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms' ;
import {SearchModel} from './searchModel';
import {TableData} from '../../../share/table/table.model';
import {dataFormat, DateObjToString, unixTime} from '../../../format/index';
import {CommonMsgService} from '../../../service/msg/index';
import {Router} from '@angular/router';
import {SessionStorageService} from '../../../service/storage/index';
import {ObjToArray} from '../../../share/tool/index';
import {filter} from 'rxjs/operators';
import {Response} from '../../../share/model/index';
import {ReportService} from '../../../service/collectionManagement/report.service';
import {NzTreeNode, NzTreeNodeOptions} from 'ng-zorro-antd';
import {injectTemplateRef} from '@angular/core/src/render3';
import {group} from '@angular/animations';

let __this;

@Component({
  selector: '',
  templateUrl: './stageReport.component.html',
  styleUrls: ['./stageReport.component.less']
})
export class StageReportComponent implements OnInit {

  constructor(
    private translateSer: TranslateService,
    private msg: CommonMsgService,
    private router: Router,
    private sgo: SessionStorageService,
    private fb: FormBuilder,
    private service: ReportService,
  ) {
  } ;

  searchModel: SearchModel = new SearchModel();
  languagePack: Object;
  reportType: Array<String>;
  tableData: TableData;
  chType:number=1;
  ngOnInit() {
    __this = this;
    this.searchModel.startDay = unixTime((new Date()),"y-m-d");
    this.searchModel.endDay = unixTime((new Date()),"y-m-d");
    this.getLanguage();
  };
  getLanguage() {
    this.translateSer.stream(['collectionManagement.stageReport', 'common'])
      .subscribe(
        data => {
          this.languagePack = {
            common: data['common'],
            table: data['collectionManagement.stageReport'],
          };
          this.reportType=this.languagePack["table"]["reportType"];
          this.initialTable();
        }
      );
  };
  changeStatus(data){
    this.chType=data;
    this.initialTable();
  }
  initialTable() {
    if(this.chType==1){
      this.initTotal();
    }
    if(this.chType==2){
      this.initDetails();
    }
  }
  initTotal(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        // {
        //   name: __this.languagePack['table']['id'],
        //   reflect: 'id',
        //   type: 'text'
        // },
        {
          name: __this.languagePack['table']['stageName'],
          reflect: 'stageName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['fromTime'],
          reflect: 'startOverdueTime',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['toTime'],
          reflect: 'endOverdueTime',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['beforeStayNumber'],
          reflect: 'beforCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['addCases'],
          reflect: 'newlyAddCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['successCases'],
          reflect: 'successCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['distribution'],
          reflect: 'anewAllotCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['failCases'],
          reflect: 'failCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['urgentCases'],
          reflect: 'urgentRecallCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['currentCasesNumber'],
          reflect: 'surplusUrgentRecallCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['recallRate'],
          reflect: 'urgentRecallSuccessRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallSuccessRatio =item['urgentRecallSuccessRatio'];
            if(urgentRecallSuccessRatio!=null){
              return (urgentRecallSuccessRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        },
        {
          name: __this.languagePack['table']['failureRate'],
          reflect: 'urgentRecallFailRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallFailRatio =item['urgentRecallFailRatio'];
            if(urgentRecallFailRatio!=null){
              return (urgentRecallFailRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ]
    };
    this.getList();
  }
  initDetails(){
    this.tableData = {
      loading: false,
      showIndex: true,
      tableTitle: [
        {
          name: __this.languagePack['table']['date'],
          reflect: 'day',
          type: 'text',
          filter:(item)=>{
            return item['day'] ? unixTime(<Date>item['day'],"y-m-d") : "";
          }
        },
        // {
        //   name: __this.languagePack['table']['id'],
        //   reflect: 'day',
        //   type: 'text'
        // },
        {
          name: __this.languagePack['table']['stageName'],
          reflect: 'stageName',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['fromTime'],
          reflect: 'startOverdueTime',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['toTime'],
          reflect: 'endOverdueTime',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['beforeStayNumber'],
          reflect: 'beforCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['addCases'],
          reflect: 'newlyAddCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['successCases'],
          reflect: 'successCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['distributionCases'],
          reflect: 'anewAllotCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['failCases'],
          reflect: 'failCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['urgentCases'],
          reflect: 'urgentRecallCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['currentCasesNumber'],
          reflect: 'surplusUrgentRecallCount',
          type: 'text'
        },
        {
          name: __this.languagePack['table']['recallRate'],
          reflect: 'urgentRecallSuccessRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallSuccessRatio =item['urgentRecallSuccessRatio'];
            if(urgentRecallSuccessRatio!=null){
              return (urgentRecallSuccessRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        },
        {
          name: __this.languagePack['table']['failureRate'],
          reflect: 'urgentRecallFailRatio',
          type: 'text',
          filter : (item) => {
            let urgentRecallFailRatio =item['urgentRecallFailRatio'];
            if(urgentRecallFailRatio!=null){
              return (urgentRecallFailRatio*100).toFixed(2)+"%"
            }else{
              return 0;
            }
          }
        }
      ]
    };
    this.getList();
  }
  export(){
      this.exportData();
  }
  searchData(){
    let model=this.searchModel;
    let etime = unixTime(<Date>model.endDay,"y-m-d");
    model.startDay = model.startDay ? unixTime((<Date>model.startDay),"y-m-d")+" 00:00:00" : null;
    model.endDay = etime ? etime + " 23:59:59" : etime;
    let start=(new Date(model.startDay)).getTime();
    let end=(new Date(model.endDay)).getTime();
    if( start - end >0 ){
      model.startDay=null;
      model.endDay=null;
    }
    return model;
  }
  exportData(){
    let model=this.searchData();
    this.service.exportOverdueReceivableStageStatement(model);
  }
  totalSize: number = 0;
  getList(){
    let model=this.searchData();
    this.tableData.loading=true;
    this.service.getOverdueReceivableStageStatement(model)
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
          if(this.chType==1){
            this.tableData.data= (< Array<Object> >res.data['statisticsTotalVOS']);
          }
          if(this.chType==2){
            this.tableData.data= (< Array<Object> >res.data['stageStatisticsVOS']);
          }

          if(res.page){
            this.totalSize = res.page["totalNumber"] || 0;
          }else{
            this.totalSize =0;
          }
        }
      );
  }
  pageChange($size : number , type : string) : void{
    if(type == 'size'){
      this.searchModel.pageSize = $size ;
    };

    if(type == 'page'){
      this.searchModel.currentPage = $size ;
    };
    this.initialTable();
  };
  reset(){
    this.searchModel = new SearchModel ;
    this.searchModel.startDay = unixTime((new Date()),"y-m-d");
    this.searchModel.endDay = unixTime((new Date()),"y-m-d");
    this.initialTable();
  };
  search(){
    this.searchModel.currentPage = 1 ;
    this.initialTable();
  };
}
